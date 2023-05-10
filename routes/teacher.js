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

router.get('/student',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=res1[0].classid
  console.log(res1)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? "
  db.query(sql,[clas,instid,depid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('teacher/student', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
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
  res.render('teacher/profile',{ teacher:true,title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res2 })

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
      var sql="SELECT *, student.firstname, student.lastname, class.classname, studentclassmap.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN trip ON dailystudent.tripid = trip.tripid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmap on studentclassmapp.studentid=student.studentid WHERE studentclassmap.classid=? and student.institutioncode = ? AND student.status = 'active';"
        db.query(sql,[clas,instid],(err,res2)=>{
        if(err){console.log("database fetching error",err);res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res2.length>0){
            dt=res2
            console.log(dt)
            res.render('teacher/studenttravellog', {teacher:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
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
module.exports = router;
