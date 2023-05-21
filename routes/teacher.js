var express = require('express');
var router = express.Router();
var db = require('../config/connection')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const Helper=require('../config/tablename');
const { route } = require('./inst');
const path=require('path')
const verifyLogin=(req,res,next)=>{
    if(req.session.loggedIn){
      next()
    }
    else{res.redirect('/')}
}

router.get('/student',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  console.log(res1)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? "
  db.query(sql,[clas,instid,depid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('teacher/student', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        er2=req.session.rfiderror;
        var showalert=false;
        if(req.session.rfiderror != "" && req.session.rfiderror != undefined && req.session.rfiderror!=null)
        {
          showalert=true;
        }
        console.log("crtvbynjmk,lxdcfvgbhnjmk")
        res.render('teacher/student', {showalert,er2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        console.log(er2);
        req.session.rfiderror="";
        showalert=false;
      }
      else{res.render('teacher/student', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});



router.get('/addstudent',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  var clas=res1[0].classid
  console.log(clas)
  // var depid=res1[0].departmentid
  // var sql="select * from class where departmentid=? and institutioncode=?"
  // db.query(sql,[depid,instid],(err,result)=>{
  //   if(err){console.log("Error in fetching class");
    res.render('teacher/addstudent', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  //   else{
  //     var clas=result
  //     res.render('teacher/addstudent', {clas,res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  //   }
  // })
  // console.log(res1[0].companyid)
  // res.render('teacher/addstudent', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
   
  //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/addstudent',async(req,res)=>{
  var res1=req.session.data
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  var password=req.body.password
  console.log(req.body.password)
  var encryptpassword= await bcrypt.hash(password,saltRounds);
  console.log(encryptpassword)
  var type=3
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.admissionnumber,req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.dob,req.body.address,depid,req.body.fathername,req.body.mothername,req.body.fatheremail,req.body.fathermobile,req.body.motheremail,req.body.motherphone,req.body.guardianname,req.body.guardianemail,req.body.guardianphone,res1[0].staffid,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
  const louser=[[req.body.email,encryptpassword,type,res1[0].institutioncode,date,res1[0].staffid,'active',res1[0].institutioncode]]
   var sql1="INSERT INTO student (admissionnumber,firstname,lastname,email,phone,dob,address,departmentid,fathername,mothername,fatheremail,fathermobile,motheremail,motherphone,guardianname,guardianemail,guardianphone,addedby,institutioncode,tenentid,status,addeddate) VALUES ?"
   var sql="INSERT INTO login (username,password,type,tenentid,createddate,createdby,status,institutioncode) VALUES ?"
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to student")
        db.query(sql,[louser],(err1,res2)=>{
          if(err1){console.log(err1); res.redirect("/teacher/student")}    
          else{
            console.log("Entry sucess in login")
            var sql2="select * from student where admissionnumber=? and institutioncode=?"
            db.query(sql2,[req.body.admissionnumber,res1[0].institutioncode],(err2,ress3)=>{
              if(err2){console.log("error fetching from student");}
              else{
                sdata=ress3
                var sql4="insert into studentclassmapping (studentid,classid,institutioncode,tenentid,status,addeddate) values ?"
                const user2=[[sdata[0].studentid,clas,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
                db.query(sql4,[user2],(err4,ress4)=>{
                  if(err4){console.log("error in class mapping",err4);res.redirect("/teacher/student")}
                  else{
                    console.log("enter in class mapping")
                    res.redirect("/teacher/student")
                  }
                })
              }
            })
           // res.redirect("/teacher/student")
          }
        })
        
    }
      
  })
  
  
 
      
  }
)


router.get('/profile',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  var clas=res1[0].classid
  console.log(clas)
  console.log(req.session.rfidstudentid);
  var res2=req.session.data
  console.log(res2)
  var pc=req.session.pc
  res.render('teacher/profile',{pc, teacher:true,title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res2,res1 })
  req.session.pc=false
  });
  router.get('/studenttripmap',verifyLogin, function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    var depid=res1[0].departmentid
    var clas=res1[0].classid
    console.log(res1)
    var sql="SELECT *, studentclassmapping.classid, class.classname,trip.tripname FROM student INNER JOIN trip on trip.tripid=(select studenttripmap.tripid from studenttripmap inner join student on studenttripmap.studentid=student.studentid) INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? AND student.studentid=(select studenttripmap.studentid from studenttripmap)"
    db.query(sql,[clas,instid,depid],(err,res2)=>{
      if(err){console.log("database fetching error",err);res.render('teacher/studenttripmap', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      else {
        if(res2.length>0){
          dt=res2
          console.log(dt)
          res.render('teacher/studenttripmap', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        }
        else{res.render('teacher/studenttripmap', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      }
  
    })
    // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  });
  router.get('/assignbus',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    var clas=res1[0].classid
    console.log(clas)
    var depid=res1[0].departmentid
    var sql="select * from student where departmentid=? and institutioncode=? and status='active';"
    db.query(sql,[depid,instid],(err,result)=>{
       if(err){console.log("Error in fetching data");
      res.render('teacher/assignbus', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
       else{
         var stud=result
         var sql2="select * from trip where institutioncode=? and status='active'";
         db.query(sql2,[instid],(err2,ress2)=>{
          if(err2){console.log(err2);
            res.render('teacher/assignbus', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
            }
          else
          {
            if(ress2.length>0){
             var trip = ress2;
             res.render('teacher/assignbus', {stud,trip,res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
            }
            }
          }
         )
         //res.render('teacher/assignbus', {clas,res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
       }
     })
     //console.log(res1[0].companyid)
     //res.render('teacher/addstudent', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
     
    //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });
  
  router.post('/assignbus',async(req,res)=>{
    var res1=req.session.data
    var depid=res1[0].departmentid
    var clas=res1[0].classid
    
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    const user=[[req.body.studentid,req.body.tripid,req.body.time,res1[0].staffid,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
    //const louser=[[req.body.email,encryptpassword,type,res1[0].institutioncode,date,res1[0].staffid,'active',res1[0].institutioncode]]
     var sql1="INSERT INTO studenttripmap (studentid,tripid,time,addedby,institutioncode,tenentid,status,addeddate) VALUES ?"
     var sql="INSERT INTO login (username,password,type,tenentid,createddate,createdby,status,institutioncode) VALUES ?"
    db.query(sql1,[user],function (err,result){
        if(err) console.log(err)
        else{
          console.log("enterted to studenttripmap");
          
                      res.redirect("/teacher/assignbus")
                    }
      })
    
        
    }
  );


  // router.get('/addrfid/:id',verifyLogin,function(req, res, next) {
  //   var res1=req.session.data
  //   var instid=res1[0].institutioncode;
  //   var clas=res1[0].classid
  //   console.log(clas)
  //   var depid=res1[0].departmentid
  //   var studentid=req.params.id;
  //  req.session.rfidstudentid=req.params.id;
  //  res.render('teacher/loading', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  //    });
     //console.log(res1[0].companyid)
     //res.render('teacher/addstudent', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
     
    //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
    router.post('/addrfid',verifyLogin,function(req, res, next) {
      var res1=req.session.data
      var instid=res1[0].institutioncode;
      var clas=res1[0].classid
      console.log(clas)
      var sid=req.body.studentid;
      console.log(sid)
      var dt=[[sid,instid]]
      Helper.tcpg().then((resolve)=>{
        if(resolve==false){}
        else{
          req.session.rfiderror=resolve;
          res.redirect("/teacher/student");
        }
      })
      Helper.addrfidft(dt).then((saved)=>{
        if(saved==true){
          var rf='meta http-equiv="refresh" content="10"';
          res.render('teacher/loading', {rf,res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
        }
      })
      
      // req.session.rfid=true;
      // req.session.rfsid=sid;
      // // var depid=res1[0].departmentid
      // console.log(req.session.rfid);
      
      //   res.render('teacher/loading', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
      //   //   else{
      //     var clas=result
      //     res.render('teacher/addstudent', {clas,res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
      //   }
      // })
      // console.log(res1[0].companyid)
      // res.render('teacher/addstudent', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
       
      //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
    });
    router.get("/load",(req,res)=>{
      var res1=req.session.data
      Helper.tcpg().then((sta)=>{
        if(sta==false){
          
          res.render('teacher/loading', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
        }
        else{
          
          req.session.rfiderror=sta;
          console.log(req.session.rfiderror);
          res.redirect("/teacher/student");
        }
      })

    })
    router.post('/addfinger',verifyLogin,function(req, res, next) {
      var res1=req.session.data
      var instid=res1[0].institutioncode;
      var clas=res1[0].classid
      //console.log(clas)
      var sid=req.body.studentid;
      console.log(sid)
      //var dt=[[sid,instid]];
      Helper.addfingert(sid).then((saved)=>{
        if(saved==true){
          res.render('teacher/loading', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
        }
      })
    });
    router.post('/removefinger',verifyLogin,function(req, res, next) {
      var res1=req.session.data
      var instid=res1[0].institutioncode;
      var clas=res1[0].classid
      //console.log(clas)
      var sid=req.body.studentid;
      console.log(sid)
      //var dt=[[sid,instid]];
      Helper.delfingert(sid).then((saved)=>{
        if(saved==true){
          res.render('teacher/loading', {res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
        }
      })
    });


     router.get('/studenttravellog',verifyLogin, function(req, res, next) {
      var res1=req.session.data
      var instid=res1[0].institutioncode;
      var depid=res1[0].departmentid
      var clas=res1[0].classid
      console.log(res1)
      var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.vehicleid=dailystudent.assignedvechileid;"
        db.query(sql,[clas,instid],(err,res2)=>{
        if(err){console.log("database fetching error",err);res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res2.length>0){
            dt=res2
            console.log(dt)
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.vehicleid<>dailystudent.assignedvechileid;"
            db.query(sql1,[clas,instid],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err);res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt1=ress2
                res.render('teacher/studenttravellog', {dt1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        }
    
      })
      // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
    });

    router.get("/demotest",(req,ress)=>{
      var vehicleid=1;
            var instid1="SJCET";
            var sql="select rfidid from studentrfidmap where institutioncode=?";
            db.query(sql,[instid1],(err,ress)=>{
                if(err){console.log(err);resolve("error");}
                else
                {   var fingerid=-1;
                  console.log(ress.length)
                  var e=parseInt(ress.length) -2;
                  console.log(e)
                  console.log(ress[e].rfidid)
                //     if(ress.length>0)
                //     { 
                        
                //         var len=parseInt( ress.length);
                //         console.log (ress[0].fingerid)
                //         for (let i = 0;i < len; i++) {
                //           let j=0;
                //             if(parseInt(ress[i].fingerid) != j)
                //             {
                //                 console.log(ress[i].fingerid,"dtfghjkldfgyhu");
                //                 fingerid=i;
                //                 break;
                //             }
                //             j++;
                //         }
                //         if(fingerid==-1)
                //         {
                //             fingerid=parseInt(len);
                //         }
                //     }
                //     else
                //     {
                //         fingerid=0;
                //     }
                //     //resolve(fingerid)
                 }
                // console.log(fingerid)
            })
            
        
    })
router.post("/profileofeachstudent",(req,res)=>{
  req.session.profilesid=req.body.studentid;
  res.redirect("/teacher/eachstudent")
})
router.get("/eachstudent",verifyLogin,(req,res)=>{
  var res1=req.session.data
  var studentid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  var isrdifadded=false;
  var isfingeradded=false;
  console.log(res1)
  var comment="";
  if(req.session.rfiddel)
  {
    comment="RFID card deleted";
    req.session.rfiddel=false;
  }
  var sqll1="select * from studentrfidmap where studentid=?"
  db.query(sqll1,[studentid],(errr1,resss1)=>{
    if(errr1){console.log(errr1)}
    else
    {
      //console.log(resss1)
      if(resss1.length>0)
      {
        isrdifadded='yes'
      }
    }
  })
  var sqll2="select * from studentfingermap where studentid=? and status='active'"
  db.query(sqll2,[studentid],(errr2,resss2)=>{
    if(errr2){console.log(errr2)}
    else
    {
      if(resss2.length>0)
      {
        //console.log(resss2)
        isfingeradded='yes'
      }
    }
  })
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,studentid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('teacher/eachstudent', {isfingeradded,isrdifadded,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
       
        console.log(isfingeradded,isrdifadded)
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid;"
        db.query(sql,[clas,instid,studentid],(err3,res3)=>{
        if(err3){console.log("database fetching error",err);res.render('teacher/eachstudent', {isfingeradded,isrdifadded,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid;"
            db.query(sql1,[clas,instid,studentid],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err);res.render('teacher/eachstudent', {isfingeradded,isrdifadded,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                console.log("2563845")
                res.render('teacher/eachstudent', {isfingeradded,isrdifadded,comment,dt1,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid;"
            db.query(sql1,[clas,instid,studentid],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err);res.render('teacher/eachstudent', {isfingeradded,isrdifadded,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress4;
                console.log("2563845")
                res.render('teacher/eachstudent', {isfingeradded,isrdifadded,comment,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('teacher/eachstudent', {isfingeradded,isrdifadded,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  console.log(studentid)
  //res.render('teacher/eachstudent',{teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })
})



// app.get('/okdata/:id', (req, res) => {
//   var res1=req.session.data
//   var instid=res1[0].institutioncode;
//   var depid=res1[0].departmentid
//   var clas=res1[0].classid
//   var studentid=req.param.id
//   const sql = "SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid;";

//   db.query(sql,[clas,instid,studentid],(error, results) => {
//     if (error) {
//       res.status(500).json({ error: 'Error fetching data from database' });
//     } else {
//       res.json({ data: results });
//     }
//   });
// });
router.post("/genmonthreport",verifyLogin,(req,res)=>{
  var res1=req.session.data
  //var sid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  var sid=req.body.studentid;
  req.session.msid=sid;
  var month=req.body.month;
  var year=req.body.year;
  mm=month;
  my=year;
  console.log(sid,month,year)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,sid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('teacher/studentreport', {mm,my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid and month(dailystudent.date)=? and year(dailystudent.date)=?;"
        db.query(sql,[clas,instid,sid,month,year],(err3,res3)=>{
        if(err3){console.log("database fetching error",err3);res.render('teacher/studentreport', {mm,my,dt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var oket=res3.length
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and month(dailystudent.date)=? and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,month,year],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err1);res.render('teacher/studentreport', {mm,my,dt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                var noet=ress2.length
                console.log("2563845")
                res.render('teacher/studentreport', {mm,my,oket,noet,dt1,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and month(dailystudent.date)=? and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,month,year],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err4);res.render('teacher/studentreport', {mm,my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })}
              else
              {
                dt2=ress4;
                var noet=ress4.length
                console.log("2563845")
                res.render('teacher/studentreport', {mm,my,noet,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('teacher/studentreport', {mm,my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
})

router.post("/studentfullprofile",verifyLogin,(req,res)=>{
  var sid=req.body.studentid;
  
  var res1=req.session.data
  var insti=res1[0].institutioncode
  var sql="SELECT student.*, class.classname, trip.tripname, studenttripmap.tripid, vehicle.regnumber, vehicletripmap.vehicleid FROM student INNER JOIN studenttripmap ON studenttripmap.studentid = student.studentid INNER JOIN class ON class.classid = (SELECT studentclassmapping.classid FROM studentclassmapping WHERE studentclassmapping.studentid = student.studentid) INNER JOIN vehicletripmap ON vehicletripmap.tripid = (SELECT studenttripmap.tripid FROM studenttripmap WHERE studenttripmap.studentid = student.studentid) INNER JOIN trip ON trip.tripid = studenttripmap.tripid INNER JOIN vehicle ON vehicle.vehicleid = vehicletripmap.vehicleid WHERE student.studentid = ? AND student.institutioncode = ? AND student.status = 'active' ";
  db.query(sql,[sid,insti],(err,ress)=>{
    if(err){console.log(err);}
    else
    {
      if(ress.length>0){
      var dt=ress;
      console.log(dt)
      res.render('teacher/studentfullprofile', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else
      {
        var sql1="select student.*, class.classname from student inner join class on class.classid=(select studentclassmapping.classid from studentclassmapping where studentclassmapping.studentid=student.studentid) where student.studentid=? and student.status='active'"
        db.query(sql1,[sid],(err1,ress1)=>{
          if(err1){console.log(err1)}
          else{
          var dt=ress1;
          res.render('teacher/studentfullprofile', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
        })
      }
    }
  })
})

router.post("/editstudentprofile",verifyLogin,(req,res)=>{
  var res1=req.session.data
  var sid=req.body.studentid;
  console.log(sid)
  var sql="select * from student where studentid=?"
  db.query(sql,[sid],(err,ress)=>{
    if(err){
      console.log(err)
    }
    else{
      var dt=ress;
      console.log(dt)
      res.render('teacher/editstudentprofile', {sid,res1,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'',dt });

    }
  })
})
router.post('/editstudent',(req,res)=>{
  console.log(req.body)
  var res1=req.session.data
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.admissionnumber,req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address,depid,req.body.fathername,req.body.mothername,req.body.fatheremail,req.body.fathermobile,req.body.motheremail,req.body.motherphone,req.body.guardianname,req.body.guardianemail,req.body.guardianphone,res1[0].staffid,res1[0].institutioncode,res1[0].institutioncode,'active',date,req.body.studentid]]
   var sql1="UPDATE student SET admissionnumber = ?, firstname = ?,  lastname = ?, email = ?, phone = ?, address = ?, departmentid = ?, fathername = ?, mothername = ?, fatheremail = ?, fathermobile = ?,  motheremail = ?, motherphone = ?, guardianname = ?, guardianemail = ?, guardianphone = ?, addedby = ?, institutioncode = ?, tenentid = ?, status = ?, addeddate = ? WHERE studentid = ?;"
  db.query(sql1,[req.body.admissionnumber,req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address,depid,req.body.fathername,req.body.mothername,req.body.fatheremail,req.body.fathermobile,req.body.motheremail,req.body.motherphone,req.body.guardianname,req.body.guardianemail,req.body.guardianphone,res1[0].staffid,res1[0].institutioncode,res1[0].institutioncode,'active',date,req.body.studentid],(err2,ress3)=>{
              if(err2){console.log(err2);}
              else{
                console.log("updated sucessfully");
                req.session.esid=req.body.stuentid
                res.redirect("/teacher/eachstudent")
              }
            })
           // res.redirect("/teacher/student")
          }
)


router.post("/gendailyreport",verifyLogin,(req,res)=>{
  var res1=req.session.data
  //var sid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  var sid=req.body.studentid;
  req.session.msid=sid;
  //var month=req.body.month;
  //var year=req.body.year;
  dd=req.body.date;
  //my=year;
  //console.log(sid,month,year)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,sid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('teacher/studentreport', {mm,my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid and dailystudent.date=?;"
        db.query(sql,[clas,instid,sid,dd],(err3,res3)=>{
        if(err3){console.log("database fetching error",err3);res.render('teacher/studentreport', {dddt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var oket=res3.length
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and dailystudent.date=?;"
            db.query(sql1,[clas,instid,sid,dd],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err1);res.render('teacher/studentreport', {dd,dt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                var noet=ress2.length
                console.log("2563845")
                res.render('teacher/studentreport', {dd,oket,noet,dt1,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and dailystudent.date=?;"
            db.query(sql1,[clas,instid,sid,dd],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err4);res.render('teacher/studentreport', {dd,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })}
              else
              {
                dt2=ress4;
                var noet=ress4.length
                console.log("2563845")
                res.render('teacher/studentreport', {dd,noet,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('teacher/studentreport', {dd,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
});

router.post("/genyearlyreport",verifyLogin,(req,res)=>{
  var res1=req.session.data
  //var sid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  var sid=req.body.studentid;
  req.session.msid=sid;
 // var month=req.body.month;
  var year=req.body.year;
 // mm=month;
  my=year;
 // console.log(sid,month,year)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,sid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('teacher/studentreport', {my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid and year(dailystudent.date)=?;"
        db.query(sql,[clas,instid,sid,year],(err3,res3)=>{
        if(err3){console.log("database fetching error",err3);res.render('teacher/studentreport', {my,dt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var oket=res3.length
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,year],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err1);res.render('teacher/studentreport', {my,dt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                var noet=ress2.length
                console.log("2563845")
                res.render('teacher/studentreport', {my,oket,noet,dt1,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,year],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err4);res.render('teacher/studentreport', {my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })}
              else
              {
                dt2=ress4;
                var noet=ress4.length
                console.log("2563845")
                res.render('teacher/studentreport', {my,noet,dt2,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('teacher/eachstudent', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('teacher/studentreport', {my,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
})
router.post("/editprofile",(req,res)=>{
  var res1=req.session.data
  var staffid=req.body.staffid;
  var sql="select * from staff inner join designation on staff.designationid=designation.designationid where staffid=?"
  db.query(sql,[staffid],(err,ress)=>{
    if(err){console.log(err)}
    else
    {
      if(ress.length>0)
      {
        dt=ress;
        res.render('teacher/editprofile', {dt,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'',res1 });

      }
    }
  })
})


router.post('/editprofile1',verifyLogin,(req,res)=>{
  var res1=req.session.data
 
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.firstname,req.body.lastname,req.body.email,req.body.mobile,req.body.address]]
  
  var sql1 = "UPDATE staff SET firstname = ?, lastname = ?, email = ?, mobile = ?, address = ? WHERE staffid = ?";
  db.query(sql1,[req.body.firstname,req.body.lastname,req.body.email,req.body.mobile,req.body.address,req.body.staffid],function (err,result){
      if(err) console.log(err)
      else{
        console.log("updated to staff")
        res.redirect("/teacher/profile")
        
    }
      
  })

  }
)

router.post("/changepassword",verifyLogin,(req,res)=>{
  res1=req.session.data
  var staffid=req.body.staffid
  var email=req.body.email
  res.render('teacher/changepassword', {staffid,email,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',p3:'',res1 });

  
})
router.post("/changepassword1",verifyLogin, async(req,res)=>{
  res1=req.session.data
  var staffid=req.body.staffid
  var email=req.body.email
  var password=req.body.password
  console.log(req.body.password)
  var encryptpassword= await bcrypt.hash(password,saltRounds);
  var sql="update login set password=? where username=?"
  db.query(sql,[encryptpassword,email],(err,ress)=>{
    if(err)console.log(err)
    else{
      console.log("password changed");
      req.session.pc=true
      res.redirect("/teacher/profile");
    }
  })
  // res.render('teacher/changepassword', {staffid,email,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',p3:'',res1 });

  
})
router.post("/livelocation",(req,res)=>{
  var res1=req.session.data
  var busid=req.body.busid;
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  var sql="select * from vehiclelivelocation where vehicleid=? and date=? "
  db.query(sql,[busid,date],(err,ress)=>{
    if(err){console.log(err)}
    else
    {
      if(ress.length>0){
      var re=ress
      
      var latitude=re[0].latitude
       var longitude=re[0].longitude
       req.session.livebusid=busid
       console.log(re,latitude,longitude)
      res.render('teacher/livelocation1', {busid,latitude,longitude,teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p4:'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'});
      }
    }
  })
 
})
router.get("/po",(req,res)=>{
  res1=req.session.data
  console.log(res1)
  res.render('teacher/livelocation1', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',p3:'',res1 });

})
router.get('/location1', (req, res) => {
  var busid=req.session.livebusid
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  // Execute MySQL query to fetch the latest latitude and longitude from the database
  var sql="select latitude,longitude from vehiclelivelocation where vehicleid=? and date=? "
  db.query(sql,[busid,date], (error, results) => {
    if (error) throw error;
    else{ 
    const { latitude, longitude } = results[0];  
    // Send the latitude and longitude as JSON response
    res.json({ latitude, longitude });
    }
  });
});
router.post("/removerfid",(req,res)=>{
  res1=req.session.data
  var insti=res1[0].institutioncode
  var studentid=req.body.studentid;
  var sql="delete from studentrfidmap where studentid=? and institutioncode=?"
  db.query(sql,[studentid,insti],(err,ress)=>{
    if(err){console.log(err)}
    else
    {
      console.log(deleted);
      req.session.profilesid=req.body.studentid;
      req.session.rfiddel=true
      res.redirect("/teacher/eachstudent")
    }
  })
})
module.exports = router;
