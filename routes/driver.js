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


    module.exports = router;