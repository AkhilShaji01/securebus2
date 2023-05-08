var express = require('express');
var router = express.Router();
var db = require('../config/connection')
const bcrypt = require('bcrypt');
const { route } = require('./inst');
const saltRounds = 10;
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'SecureBus',style:'dist/css/adminlte.min.css',plug:'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition dark-mode sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed' });
// });


router.get('/sn', function(req, res, next) {
  res.render('sn', { title: 'v',style:'dist/css/adminlte.min.css',plug:'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'plugins/fontawesome-free/css/all.min.css' });
});
router.get('/', function(req, res, next) {
  if(req.session.logerror){
    var rt="Incorrect email or password"
    req.session.logerror=false
  }
  res.render('login', {rt, title: 'SecureBUS',style:'dist/css/adminlte.min.css',plug:'/plugins/icheck-bootstrap/icheck-bootstrap.min.css',plug1:'plugins/fontawesome-free/css/all.min.css',login1:true,bodyclass:'hold-transition login-page' });
});

router.post('/sn',async(req,res)=>{
  var password=req.body.password
  console.log(req.body.password)
  var encryptpassword= await bcrypt.hash(password,saltRounds);
  console.log(encryptpassword)
  var type=0
  console.log(req.body.email)
  const user=[[1,req.body.email,encryptpassword,type,req.body.companyid,0,req.body.createddate,'securebus','active']]
  const louser=[[req.body.companyid,req.body.name,req.body.email,req.body.phone,req.body.officephone,req.body.officeaddress,req.body.websiteurl,req.body.createddate,'active']];
  console.log(louser)
   var sql1="INSERT INTO login (loginid,username,password,type,id,tenentid,createddate,createdby,status) VALUES ?"
   var sql="INSERT INTO company (companyid,name,email,phone,officephone,officeaddress,websiteurl,createddate,status) VALUES ?"
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to login")
    }
      
  })
  db.query(sql,[louser],function (err, result) {
    if (err) {console.log(err)
    // res.signerr=true;
    res.redirect('/sn')
}
    else{
        console.log("sign up success")
        res.redirect('/')
    }
    
})
  
 
      
  }
)
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

router.post('/login',async(req,res)=>{
  var password=req.body.password;
  var email=req.body.email
  console.log(email,password)
  var sql="select * from login where username= ?"
  db.query(sql,[email],(err,result)=>{
    if(err) {console.log("error");req.session.logerror=true;res.redirect('/login');}
    else{
      var data=result
      // console.log(data[0].password)
      if(result.length>0){
        const bcryptPassword = bcrypt.compareSync(password, result[0].password);
        if(bcryptPassword)
        {
          req.session.loggedIn=true;
         // req.session.data=result;
          
          if(result[0].type==0)
          {
            var sql1="select * from company where email= ?"
            db.query(sql1,[email],(err,ress)=>{
              if(err) {console.log("error");res.redirect('/login');}
              else{
                      req.session.data=ress
                    var res1=ress
                    console.log(res1)
                      console.log(req.session.data)

                      console.log(req.session.data);
            res.render('superadmin/profile',{ title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1
              })
            }
          })
          }
          if(result[0].type==1)
          {
            var sql1="select * from institution where email= ?"
            db.query(sql1,[email],(err,ress)=>{
              if(err) {console.log("error");res.redirect('/login');}
              else{
                req.session.data=ress
                var res1=ress
                    console.log(res1)
                    //res.redirect("/inst/profile")
            res.render('insti/profile',{ inst:true,title: 'SecureBus',style:'dist/css/adminlte.min.css',plug:'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1
              })
            }
          })
          }
          if(result[0].type==2)
          {
            var sql1="select * from staff where email= ?"
            db.query(sql1,[email],(err,ress)=>{
              if(err) {console.log("error");res.redirect('/login');}
              else{
                    var res1=ress
                    if(res1[0].roleid='R1')
                    {
                      console.log(res1)
                      var sql2="SELECT *, department.name AS departmentname, designation.name AS designationname, teacherclassmapping.classid, class.classname FROM staff INNER JOIN department ON department.departmentid = staff.departmentid  INNER JOIN designation ON designation.designationid = staff.designationid INNER JOIN teacherclassmapping ON teacherclassmapping.teacherid = staff.staffid INNER JOIN class ON class.classid=(select teacherclassmapping.classid from teacherclassmapping WHERE teacherclassmapping.teacherid=staff.staffid) WHERE email = ?;"
                      db.query(sql2,[email],(err2,ress2)=>{
                        if(err2){console.log("error in session entry");res.redirect('/')}
                        else{
                          req.session.data=ress2
                          var res2=ress2
                          console.log(res2)
                          //res.redirect("/teacher/profile")
                          res.render('teacher/profile',{ teacher:true,title: 'SecureBus',style:'dist/css/adminlte.min.css',plug:'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res2 })
                        }
                      })
                      // res.render('teacher/profile',{ teacher:true,title: 'SecureBus',style:'dist/css/adminlte.min.css',plug:'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })
                    }
                    else{
                      req.session.data=ress
                      var res1=ress
                      console.log(res1)
                      res.render('driver/profile',{ teacher:true,title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1
                      })
                    }
                    
            }
          })
          }
          if(result[0].type==3)
          {
            console.log("vghhbvhjcvbhc")
            var sql1="SELECT *, studentclassmapping.classid, class.classname FROM student INNER JOIN studentclassmapping ON student.studentid = studentclassmapping.studentid INNER JOIN class ON class.classid = studentclassmapping.classid where student.email=?"
            db.query(sql1,[email],(err,ress)=>{
              if(err) {console.log("error");res.redirect('/');}
              else{
                  req.session.data=ress
                  var res1=ress
                  //res.redirect('/student/profile')
                  res.render('student/profile',{ student:true,title: 'SecureBus',style:'dist/css/adminlte.min.css',plug:'plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1   })
                    
            }
          })
          }
          if(result[0].type==4)
          {
            data=req.session.data;
            console.log(data)
            res.render('index',{driver:true,data,style:'dashsadmin.css'})
          }
        }
        else
          {
            console.log("752387563745")
            req.session.logerror=true;
           res.redirect('/');
         }
      }
      else{
        req.session.logerror=true;
        res.redirect('/')
        }
      }
    })
})
router.get('/map',(req,res)=>{
  res.render("map",{style:"dist/css/w.css"})
})
router.post('/data',(req,res)=>{
  console.log(req.body)
  
})
module.exports = router;
