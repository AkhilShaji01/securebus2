var express = require('express');
var router = express.Router();
var db = require('../config/connection')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const verifyLogin=(req,res,next)=>{
    if(req.session.loggedIn){
      next()
    }
    else{res.redirect('/')}
    }
router.post("/rfid/:id",(req,res)=>{
    busid=req.params.id;
    console.log(req.body);
    
})
router.get("/profile",(req,res)=>{
    var res1=req.session.data
    var staffid1=res1[0].staffid
    var sql="select * from staff where staffid=?"
    db.query(sql,[staffid1],(err,ress)=>{
        if(err){console.log(err)}
        else{
            if(ress.length>0)
            {
                req.session.data=ress
                res1=ress
                var sql1="select drivertripmap.*, trip.tripname, vehicletripmap.vehicleid,vehicle.regnumber from drivertripmap inner join trip on drivertripmap.tripid=trip.tripid inner join vehicletripmap on vehicletripmap.tripid=drivertripmap.tripid inner join vehicle on vehicle.vehicleid=vehicletripmap.vehicleid where drivertripmap.driverid=?"
                db.query(sql1,[staffid1],(err1,ress1)=>{
                    if(err1){console.log(err1)}
                    else
                    {
                        if(ress1.length>0)
                        {
                            res2=ress1
                            req.session.cdata=ress1
                            console.log(ress1)
                            res.render('driver/profile',{ driver:true,title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,res2})

                        }
                    }
                })
            }
        }
    })
})
router.get("/leave",verifyLogin,(req,res)=>{
    var res1=req.session.data
    var res2=req.session.cdata
    console.log(res1[0].staffid)
    var sql="SELECT DATE_FORMAT(appliedon, '%d/%m/%Y') AS formatted_appliedon,DATE_FORMAT(startdate, '%d/%m/%Y') AS formatted_startdate, DATE_FORMAT(enddate, '%d/%m/%Y') AS formatted_enddate, driverleave.* FROM driverleave WHERE driverid = ? ";
    db.query(sql,[res1[0].staffid],(err,ress)=>{
        if(err){console.log(err);    res.render('driver/leave', {driver:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,res2 })
    }
    else
    {
        dt=ress
        console.log(dt)
        res.render('driver/leave', {dt,driver:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,res2 })

    }
    })
   // res.render('driver/leave', {driver:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,res2 })

})
router.get("/applyleave",verifyLogin,(req,res)=>{
    var res1=req.session.data
    var res2=req.session.cdata
    
    res.render('driver/applyleave', {driver:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,res2 })

})
router.post("/applyleave",verifyLogin,(req,res)=>{
    var res1=req.session.data
    var res2=req.session.cdata
    //res.render('driver/applyleave', {driver:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,res2 })
    const date1 = new Date(req.body.startdate);
  const date2 = new Date(req.body.enddate);

  // Calculate the difference in milliseconds between the two dates
  const diffInMs = Math.abs(date2 - date1);
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  // Calculate the number of days by dividing the difference by the number of milliseconds in a day
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))+1;
  var user=[[req.body.driverid,date,req.body.startdate,req.body.enddate,diffInDays,'pending approval',res1[0].institutioncode]]
    var sql="insert into driverleave (driverid,appliedon,startdate,enddate,noofdays,status,institutioncode) values ?";
    db.query(sql,[user],(err,ress)=>{
        if(err){console.log(err)}
        else{
            console.log("leave applied")
            res.redirect("/driver/leave")
        }
    })
})

router.post('/changeimage',(req,res)=>{
    res1=req.session.data
    console.log(req.files.image)
  
      let image=req.files.image
      image.mv('./public/profileimages/driver'+res1[0].staffid+'.png')
      res.redirect("/driver/profile")
        
  })
  router.get("/changeimage",(req,res)=>{
    res1=req.session.data
   
        res.render('driver/uploadimage',{driver:true, title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1})
  
      
  })
module.exports = router;