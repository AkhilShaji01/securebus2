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

module.exports = router;