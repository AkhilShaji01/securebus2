var express = require('express');
var router = express.Router();
var db = require('../config/connection')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const Helper=require('../config/tablename')
const verifyLogin=(req,res,next)=>{
    if(req.session.loggedIn){
      next()
    }
    else{res.redirect('/')}
 }

router.post("/rfid1",(req,res)=>{
    busid=req.params.id;
    console.log(req.body,busid);
    
})

router.post("/data",(req,res)=>{
  //busid=req.params.id;
  console.log(req.body);
  res.status(200).send("pk");
  //res.send("pk");
})

router.get("/demo",verifyLogin,(req,res)=>{
  var res1=req.session.data
      var instid=res1[0].institutioncode;
      var clas=res1[0].classid
  var sql="SELECT student.*, trip.*,vehicel.* FROM student INNER JOIN studenttripmapping ON student.studentid = studenttripmapping.studentid INNER JOIN class ON studentclassmapping.classid = class.classid inner join vehicle.vehicleid=studenttripmapping.vehicleid WHERE studentclassmapping.classid = ? AND student.institutioncode = ?  AND student.status = 'active'";
  db.query(sql,[clas,instid],(err,ress)=>{
    if(err){console.log("bbjhb",err);}
    else{
      var dt=ress;
      console.log(dt);   }
  })
});
router.get('/test',(req,res)=>{
  if(req.session.rfid==true){console.log("xdfcgvhbjnkm")}
  console.log(req.session.rfid)
})
router.post("/start",(req,res)=>{
  //busid=req.params.id;
  var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    console.log(req.body);
    var busid=req.body.busid;
    var dt=[[busid,req.body.institutioncode,date]];
    var sql1="select * from vehiclelivelocation where date=?";
    db.query(sql1,[date],(err1,ress1)=>{
      if(err1){console.log("err1");res.status(200).send("no");}
      else
      {
        if(ress1.length>0){
          res.status(200).send("start");
        }
        else
        {
          var sql="insert into vehiclelivelocation (vehicleid, institutioncode, date) values ?"
          db.query(sql,[dt],(err,ress)=>{
            if(err){console.log(err);res.status(200).send("no");}
            else{
              res.status(200).send("start");
      }
    })
        }
      }
    })
    
  
  //res.send("pk");
})
router.post("/addrfid",(req,res)=>{
  //busid=req.params.id;
  var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    console.log(req.body);
    var busid=req.body.busid;
    var dt=[[busid,req.body.institutioncode,date]]
    //console.log(req.session.rfid)
    Helper.addrfidnd().then((studentid)=>{
      console.log(studentid);
      if(studentid==false)
      {
        res.status(200).send("no");
      }
      else
      {
        res.status(200).send("addrfid");
      }
    })
    // if(req.session.rfid==true){
    //   res.status(200).send("addrfid");
    // }
    // else{
    //   res.status(200).send("no");
    // }
  
  //res.send("pk");
});

router.post("/confirmfinger",(req,res)=>{ 
  //busid=req.params.id;
  var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    console.log(req.body);
    var cardid=req.body.cardid;
    //var studentid=req.session.rfsid;
    var instid=req.body.institutioncode;
    var dt=[[cardid,instid,'active',date]]
    Helper.confirmfinger(req.body).then((added)=>{
        if(added==false){
          res.status(200).send("no");
         // res.redirect('/teacher/stuent');
        }
        else
        {
           if(added=="already added"){
            res.status(200).send("already added");
         // res1.redirect("/nodemcu/student");
          }
          else{
            if(added==true){
            res.status(200).send("added");}
           // res.redirect("/teacher/student");
          }
        }
    })
    
  
  //res.send("pk");
})
router.get("/student",(req,res)=>{
  res.redirect("/teacher/student")
})

router.post("/checktoaddfinger",(req,res)=>{
  //busid=req.params.id;
  var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    console.log(req.body);
    var busid=req.body.busid;
    var dt=[[busid,req.body.institutioncode,date]]
    //console.log(req.session.rfid)
    Helper.addfinger().then((studentid)=>{
      console.log(studentid);
      if(studentid==false)
      {
        res.status(200).send("no");
      }
      else
      {
        res.status(200).send("addfinger");
      }
    })
    // if(req.session.rfid==true){
    //   res.status(200).send("addrfid");
    // }
    // else{
    //   res.status(200).send("no");
    // }
  
  //res.send("pk");
});

// router.post("/confirmfinger",(req,res)=>{ 
//   //busid=req.params.id;
//   var date_ob = new Date();
//     var day = ("0" + date_ob.getDate()).slice(-2);
//     var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//     var year = date_ob.getFullYear();
//     var date = year + "-" + month + "-" + day;
//     console.log(req.body);
//     var cardid=req.body.cardid;
//     //var studentid=req.session.rfsid;
//     // var instid=req.body.institutioncode;
//     // var dt=[[cardid,vehicle,'active',date]]
//     Helper.confirmfinger(req.body).then((added)=>{
//         if(added==false){
//           res.status(200).send("no");
//          // res.redirect('/teacher/stuent');
//         }
//         else
//         {
//            if(added=="already added"){
//             res.status(200).send("already added");
//          // res1.redirect("/nodemcu/student");
//           }
//           else{
//             if(added==true){
//             res.status(200).send("added");}
//            // res.redirect("/teacher/student");
//           }
//         }
//     })
    
  
//   //res.send("pk");
// })

router.post("/askfingerid",(req,res)=>{ 
  //busid=req.params.id;
  var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    console.log(req.body);
    var cardid=req.body.cardid;
    var finger1;
    //var studentid=req.session.rfsid;
    // var instid=req.body.institutioncode;
    // var dt=[[cardid,vehicle,'active',date]]
    Helper.askfingerid(req.body).then((fingerid)=>{
        if(fingerid=="error"){
          res.status(200).send("no");
         // res.redirect('/teacher/stuent');
        }
        else
        {
           
           console.log(fingerid)
           finger1=String(fingerid)
           console.log(finger1)
           res.status(200).send(String(fingerid));
         // res1.redirect("/nodemcu/student");
        }
    })
    
  
  //res.send("pk");
})

router.post("/checktodeletefinger",(req,res)=>{
  //busid=req.params.id;
  var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    console.log(req.body);
    var busid=req.body.busid;
    var dt=[[busid,req.body.institutioncode,date]]
    //console.log(req.session.rfid)
    Helper.checktodeletefinger().then((studentid)=>{
      console.log(studentid);
      if(studentid==false)
      {
        res.status(200).send("no");
      }
      else
      {
        var fids=toString(studentid);
        res.status(200).send(fids);
      }
    }) 
    // if(req.session.rfid==true){
    //   res.status(200).send("addrfid");
    // }
    // else{
    //   res.status(200).send("no");
    // }
  
  //res.send("pk");
});



// router.post("/askfingerid1",(req,res)=>{ 
//   //busid=req.params.id;
//   var date_ob = new Date();
//     var day = ("0" + date_ob.getDate()).slice(-2);
//     var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//     var year = date_ob.getFullYear();
//     var date = year + "-" + month + "-" + day;
//     console.log(req.body);
//     var cardid=req.body.cardid;
//     //var studentid=req.session.rfsid;
//     // var instid=req.body.institutioncode;
//     // var dt=[[cardid,vehicle,'active',date]]
//     Helper.askfingerid1(req.body).then((fingerid)=>{
//         if(fingerid==""){
//           res.status(200).send("no");
//          // res.redirect('/teacher/stuent');
//         }
//         else
//         {
//            var fins=toString(fingerid)
//            res.status(200).send(fins);
//          // res1.redirect("/nodemcu/student");
//         }
//     })
    
  
//   //res.send("pk");
// })

router.post("/rfidsensor",(req,res)=>{
  //busid=req.params.id;
  console.log(req.body);
  Helper.dailyrfid(req.body).then((studentid)=>{
    console.log(studentid);
    if(studentid==false)
    {
      res.status(200).send("no");
    }
    else 
    {
      if(studentid=="goodbye")
      {
        res.status(200).send("goodbye");
      }
      else{
      res.status(200).send("entred");
      }
    }
  }) 
  //res.status(200).send("pk");
  //res.send("pk");
})
module.exports = router;