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
  var sql="select * from student where studentid=?"
  db.query(sql,[res1[0].studentid],(err,ress)=>{
    if(err)console.log(err)
    else{
      res1=ress
      req.session.data=ress
      var sql2="select * from studenttripmap where studentid=?"
      db.query(sql2,[res1[0].studentid],(err2,ress2)=>{
        if(err2)console.log(err2)
        else
        {
          if(ress2.length>0)
          {
            var sql1 = "SELECT trip.tripname, vehicle.*, studenttripmap.tripid,class.classid, class.classname FROM studenttripmap " +
           "INNER JOIN vehicle ON vehicle.vehicleid = (SELECT vehicletripmap.vehicleid FROM vehicletripmap WHERE vehicletripmap.tripid = studenttripmap.tripid) " +
           "INNER JOIN class ON class.classid = (SELECT studentclassmapping.classid FROM studentclassmapping WHERE studentclassmapping.studentid = studenttripmap.studentid) " +
           "INNER JOIN trip ON trip.tripid = studenttripmap.tripid WHERE studenttripmap.studentid = ?";
            db.query(sql1,[res1[0].studentid],(err1,ress1)=>{
              if(err1)console.log(err1)
              else{
                dt=ress1
                console.log(dt)
                var pc=req.session.pc
                req.session.cdata=dt
                res.render('student/profile', {dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })
                req.session.pc=false
              }
           })
        }
        else
        {
          var sql3="SELECT class.classname,class.classid,studentclassmapping.classid FROM studentclassmapping inner join class on studentclassmapping.classid=class.classid where studentclassmapping.studentid=? "
          db.query(sql3,[res1[0].studentid],(err3,ress3)=>{
            if(err3)console.log(err3)
            else
            {
              dt=ress3
              var pc=req.session.pc
              req.session.cdata=dt
              res.render('student/profile', {dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })
              req.session.pc=false
            }
          })
        }
      }
      
      })


    }
  })
  //res.render('student/profile', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })
});

router.post("/editprofile",verifyLogin,(req,res)=>{
  var res1=req.session.data
  var sid=res1[0].studentid
  console.log(sid)
  var sql="select * from student where studentid=?"
  db.query(sql,[sid],(err,ress)=>{
    if(err){
      console.log(err)
    }
    else{
      var dt=ress;
      console.log(dt)
      res.render('student/editprofile', {sid,res1,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'',dt });

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
  const user=[[req.body.admissionnumber,req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address,depid,req.body.fathername,req.body.mothername,req.body.fatheremail,req.body.fathermobile,req.body.motheremail,req.body.motherphone,req.body.guardianname,req.body.guardianemail,req.body.guardianphone]]
   var sql1="UPDATE student SET admissionnumber = ?, firstname = ?,  lastname = ?, email = ?, phone = ?, address = ?, departmentid = ?, fathername = ?, mothername = ?, fatheremail = ?, fathermobile = ?,  motheremail = ?, motherphone = ?, guardianname = ?, guardianemail = ?, guardianphone = ? WHERE studentid = ?;"
  db.query(sql1,[req.body.admissionnumber,req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address,depid,req.body.fathername,req.body.mothername,req.body.fatheremail,req.body.fathermobile,req.body.motheremail,req.body.motherphone,req.body.guardianname,req.body.guardianemail,req.body.guardianphone,req.body.studentid],(err2,ress3)=>{
              if(err2){console.log(err2);}
              else{
                console.log("updated sucessfully");
               // req.session.esid=req.body.stuentid
                res.redirect("/student/profile")
              }
            })
           // res.redirect("/student/student")
          }
)
router.post("/changepassword",verifyLogin,(req,res)=>{
  res1=req.session.data
  var staffid=req.body.studentid
  var email=req.body.email
  res.render('student/changepassword', {staffid,email,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',p3:'',res1 });

  
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
      res.redirect("/student/profile");
    }
  })
  // res.render('student/changepassword', {staffid,email,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',p3:'',res1 });

  
})





router.post("/profileofeachstudent",(req,res)=>{
  req.session.profilesid=req.body.studentid;
  res.redirect("/student/eachstudent")
})
router.get("/eachstudent",verifyLogin,(req,res)=>{
  var res1=req.session.data
  var cdata=req.session.cdata
  var studentid=res1[0].studentid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=cdata[0].classid
  console.log(res1)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,studentid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid;"
        db.query(sql,[clas,instid,studentid],(err3,res3)=>{
        if(err3){console.log("database fetching error",err);res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid;"
            db.query(sql1,[clas,instid,studentid],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err);res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                console.log("2563845")
                res.render('student/eachstudent', {dt1,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('student/studenttravellog', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid;"
            db.query(sql1,[clas,instid,studentid],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err);res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress4;
                console.log("2563845")
                res.render('student/eachstudent', {dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  console.log(studentid)
  //res.render('student/eachstudent',{student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })
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
  cdata=req.session.cdata
  //var sid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=cdata[0].classid
  var sid=res1[0].studentid;
  req.session.msid=sid;
  var month=req.body.month;
  var year=req.body.year;
  mm=month;
  my=year;
  console.log(sid,month,year)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,sid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('student/studentreport', {mm,my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid and month(dailystudent.date)=? and year(dailystudent.date)=?;"
        db.query(sql,[clas,instid,sid,month,year],(err3,res3)=>{
        if(err3){console.log("database fetching error",err3);res.render('student/studentreport', {mm,my,dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var oket=res3.length
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and month(dailystudent.date)=? and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,month,year],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err1);res.render('student/studentreport', {mm,my,dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                var noet=ress2.length
                console.log("2563845")
                res.render('student/studentreport', {mm,my,oket,noet,dt1,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('student/studenttravellog', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and month(dailystudent.date)=? and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,month,year],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err4);res.render('student/studentreport', {mm,my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })}
              else
              {
                dt2=ress4;
                var noet=ress4.length
                console.log("2563845")
                res.render('student/studentreport', {mm,my,noet,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('student/studentreport', {mm,my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
})

router.post("/gendailyreport",verifyLogin,(req,res)=>{
  var res1=req.session.data
  cdata=req.session.cdata
  //var sid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=cdata[0].classid
  var sid=res1[0].studentid;
  req.session.msid=sid;
  //var month=req.body.month;
  //var year=req.body.year;
  var dd=req.body.date;
  console.log(dd)
  //my=year;
  //console.log(sid,month,year)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,sid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('student/studentreport', {mm,my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid and dailystudent.date=?;"
        db.query(sql,[clas,instid,sid,dd],(err3,res3)=>{
        if(err3){console.log("database fetching error",err3);res.render('student/studentreport', {dddt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var oket=res3.length
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and dailystudent.date=?;"
            db.query(sql1,[clas,instid,sid,dd],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err1);res.render('student/studentreport', {dd,dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                var noet=ress2.length
                console.log(dt2)
                res.render('student/studentreport', {dd,oket,noet,dt1,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('student/studenttravellog', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and dailystudent.date=?;"
            db.query(sql1,[clas,instid,sid,dd],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err4);res.render('student/studentreport', {dd,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })}
              else
              {
                dt2=ress4;
                var noet=ress4.length
                console.log("2563845")
                console.log(dt2);
                res.render('student/studentreport', {dd,noet,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt,dt1 })

                
              }
            })
            
            // res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('student/studentreport', {dd,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
});

router.post("/genyearlyreport",verifyLogin,(req,res)=>{
  var res1=req.session.data
  var cdata=req.session.cdata
  //var sid=req.session.profilesid;
  var instid=res1[0].institutioncode;
  var depid=res1[0].departmentid
  var clas=cdata[0].classid
  var sid=res1[0].studentid;
  req.session.msid=sid;
 // var month=req.body.month;
  var year=req.body.year;
 // mm=month;
  my=year;
 // console.log(sid,month,year)
  var sql="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid WHERE studentclassmapping.classid = ? AND student.institutioncode = ? AND student.departmentid = ? and student.studentid=?"
  db.query(sql,[clas,instid,depid,sid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('student/studentreport', {my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt);
        var sql="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid=dailystudent.assignedvechileid and year(dailystudent.date)=?;"
        db.query(sql,[clas,instid,sid,year],(err3,res3)=>{
        if(err3){console.log("database fetching error",err3);res.render('student/studentreport', {my,dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
        else {
          if(res3.length>0){
            dt1=res3
            console.log(dt1)
            var oket=res3.length
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,year],(err1,ress2)=>{
              if(err1){console.log("database fetching error1",err1);res.render('student/studentreport', {my,dt,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
              else
              {
                dt2=ress2;
                var noet=ress2.length
                console.log("2563845")
                res.render('student/studentreport', {my,oket,noet,dt1,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            //res.render('student/studenttravellog', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
          }
          else{
            var sql1="SELECT *, student.firstname, student.lastname, studentclassmapping.classid, vehicle.regnumber, student.admissionnumber FROM dailystudent INNER JOIN student ON dailystudent.studentid = student.studentid INNER JOIN vehicle ON vehicle.vehicleid = dailystudent.vehicleid INNER JOIN studentclassmapping on studentclassmapping.studentid=student.studentid WHERE studentclassmapping.classid=? and student.institutioncode = ? AND student.status = 'active' and dailystudent.studentid=? and dailystudent.vehicleid<>dailystudent.assignedvechileid  and year(dailystudent.date)=?;"
            db.query(sql1,[clas,instid,sid,year],(err4,ress4)=>{
              if(err4){console.log("database fetching error1",err4);res.render('student/studentreport', {my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })}
              else
              {
                dt2=ress4;
                var noet=ress4.length
                console.log("2563845")
                res.render('student/studentreport', {my,noet,dt2,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

                
              }
            })
            
            // res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt }
            }
        }
    
      })
        //res.render('student/eachstudent', {student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })

      }
      else{res.render('student/studentreport', {my,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
})
router.post('/changeimage',verifyLogin,(req,res)=>{
  res1=req.session.data
  console.log(req.files.image)

    let image=req.files.image
    image.mv('./public/profileimages/student'+res1[0].studentid+'.png')
    res.redirect("/student/profile")
      
})
router.get("/changeimage",(req,res)=>{
  res1=req.session.data
 
      res.render('student/uploadimage',{student:true, title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1})

    
})

router.post("/livelocation",verifyLogin,(req,res)=>{
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
      res.render('student/livelocation1', {busid,latitude,longitude,student:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p4:'https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css'});
      }
    }
  })
 
})
module.exports = router;
