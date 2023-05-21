var express = require('express');
var router = express.Router();
var db = require('../config/connection')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const date=(req,res,next)=>{
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  return(date)
  next()
}
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{res.redirect('/')}
  }
router.get('/insti',verifyLogin, function(req, res, next) {
    var res1=req.session.data
    console.log(res1)
    var sql="select * from institution"
    db.query(sql,(err,res2)=>{
      if(err){console.log("database fetching error");res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      else {
        if(res2.length>0){
          dt=res2
          console.log(dt)
          res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        }
        else{res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      }

    })
    // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  });
  router.get('/addinst',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    console.log(res1[0].companyid)
    res.render('superadmin/addinst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });

  router.post('/addinst',async(req,res)=>{
    var res1=req.session.data
    var password=req.body.password
    console.log(req.body.password)
    var encryptpassword= await bcrypt.hash(password,saltRounds);
    console.log(encryptpassword)
    var type=1
    console.log(req.body.email)
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    const user=[[req.body.email,encryptpassword,type,req.body.institutioncode,req.body.institutioncode,date,res1[0].companyid,'active']]
    const louser=[[req.body.institutioncode,req.body.name,req.body.phone,req.body.mobile,req.body.email,req.body.website,date,req.body.city,req.body.district,req.body.state,req.body.country,req.body.pincode,req.body.contactname,req.body.contactemail,req.body.contactphone,'true',date,res1[0].companyid,req.body.institutioncode,'active']];
    console.log(louser)
     var sql1="INSERT INTO login (username,password,type,id,tenentid,createddate,createdby,status) VALUES ?"
     var sql="INSERT INTO institution (institutioncode,name,phone,mobile,email,website,activateddate,city,district,state,country,pincode,contactname,contactemail,contactphone,isverified,createdon,createdby,tenentid,status) VALUES ?"
    db.query(sql1,[user],function (err,result){
        if(err) console.log(err)
        else{
          console.log("enterted to login")
          db.query(sql,[louser],function (err, result) {
            if (err) {console.log(err)
            // res.signerr=true;
            res.redirect('/superadmin/addinst')
        }
            else{
                console.log("sign up success")
                res.redirect('/superadmin/insti')
            }
            
        })
      }
        
    })
    
    
   
        
    }
  )

  router.get("/profile",(req,res)=>{
    res1=req.session.data
    var sql="select * from company where companyid=?"
    db.query(sql,[res1[0].companyid],(err,ress)=>{
      if(err){console.log(err)}
      else{
        var res1=ress
        req.session.data=ress
        res.render('superadmin/profile',{ title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1})
  
      }
    })
  })
  router.get("/changeimage",(req,res)=>{
    res1=req.session.data
   
        res.render('superadmin/uploadimage',{ title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1})
  
      
  })
  router.post('/changeimage',(req,res)=>{
    res1=req.session.data
    console.log(req.files.image)
  
      let image=req.files.image
      image.mv('./public/profileimages/com'+res1[0].companyid+'.png')
      res.redirect("/superadmin/profile")
        
  })

module.exports = router;
