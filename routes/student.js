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


router.get('/profile',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  res.render('student/profile', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});
module.exports = router;
