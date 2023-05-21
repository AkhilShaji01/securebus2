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
router.get('/staffmain',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    console.log(res1[0].companyid)
    var sql="select * from department where institutioncode=?"
    db.query(sql,[instid],(err,ress1)=>{
      if(err){console.log("Error in fetching department details");res.render('insti/staffmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
      else{
        dep1=ress1
        res.render('insti/staffmain', {dep1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
      }
    })
    //res.render(dep1,'insti/staffmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });


  router.get('/department',verifyLogin, function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    console.log(res1)
    var sql="select * from department where institutioncode=?"
    db.query(sql,[instid],(err,res2)=>{
      if(err){console.log("database fetching error");res.render('insti/department', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      else {
        if(res2.length>0){
          dt=res2
          console.log(dt)
          res.render('insti/department', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        }
        else{res.render('insti/department', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      }

    })
    // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  });


  router.get('/adddep',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    console.log(res1[0].companyid)
    res.render('insti/adddep', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });


  router.post('/adddep',async(req,res)=>{
    var res1=req.session.data
    
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    const user=[[req.body.name,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
   
     var sql1="INSERT INTO department (name,institutioncode,tenentid,status,addeddate) VALUES ?"
     
    db.query(sql1,[user],function (err,result){
        if(err) console.log(err)
        else{
          console.log("enterted to department")
          res.redirect("/inst/department")
          
      }
        
    })
    
    
   
        
    }
  )



  router.get('/desig',verifyLogin, function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    console.log(res1)
    var sql="select * from designation where institutioncode = ?"
    db.query(sql,[instid],(err,res2)=>{
      if(err){console.log("database fetching error");res.render('insti/desig', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      else {
        if(res2.length>0){
          dt=res2
          console.log(dt)
          res.render('insti/desig', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        }
        else{res.render('insti/desig', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      }

    })
    // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  });

  router.get('/adddesig',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    console.log(res1[0].companyid)
    res.render('insti/adddesig', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });


  router.post('/adddesig',async(req,res)=>{
    var res1=req.session.data
    
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    const user=[[req.body.name,'active',res1[0].institutioncode,res1[0].institutioncode,date]]
   
     var sql1="INSERT INTO designation (name,status,institutioncode,tenentid,addeddate) VALUES ?"
     
    db.query(sql1,[user],function (err,result){
        if(err) console.log(err)
        else{
          console.log("enterted to department")
          res.redirect("/inst/desig")
          
      }
        
    })
    
    
   
        
    }
  )




  router.get('/role',verifyLogin, function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    console.log(res1)
    var sql="select * from role where institutioncode = ?"
    db.query(sql,[instid],(err,res2)=>{
      if(err){console.log("database fetching error");res.render('insti/role', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      else {
        if(res2.length>0){
          dt=res2
          console.log(dt)
          res.render('insti/role', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        }
        else{res.render('insti/role', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      }

    })
    // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  });

  router.get('/addrole',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    console.log(res1[0].companyid)
    res.render('insti/addrole', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });


  router.post('/addrole',async(req,res)=>{
    var res1=req.session.data
    
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    const user=[[req.body.name,'active',res1[0].institutioncode,res1[0].institutioncode,date]]
   
     var sql1="INSERT INTO role (name,status,institutioncode,tenentid,addeddate) VALUES ?"
     
    db.query(sql1,[user],function (err,result){
        if(err) console.log(err)
        else{
          console.log("enterted to department")
          res.redirect("/inst/role")
          
      }
        
    })
    
    
   
        
    }
  )


  // router.get('/viewdepstaff',verifyLogin, function(req, res, next) {
  //   var res1=req.session.data
  //   var depid=req.params.id
  //   console.log(res1)
  //   var sql="select * from staff"
  //   db.query(sql,[depid],(err,res2)=>{
  //     if(err){console.log("database fetching error");res.render('insti/viewdepstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
  //     else {
  //       if(res2.length>0){
  //         dt=res2
  //         console.log(dt)
  //         res.render('insti/viewdepstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
  //       }
  //       else{res.render('insti/viewdepstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
  //     }

  //   })
  //   // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  // });





  router.get('/addstaff',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    console.log(res1[0].companyid)
    var sql="select * from role";
    db.query(sql,(err,ress1)=>{
      if(err){res.render('insti/addstaff', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
      else{
          rl=ress1;
          var sql1="select * from department where institutioncode=?"
          db.query(sql1,[instid],(err,ress2)=>{
            if(err){
              res.render('insti/addstaff', {rl,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
            }
            else{
              dep1=ress2;
              var sql2="select * from designation";
              db.query(sql2,(err,ress3)=>{
                if(err){
                  res.render('insti/addstaff', {dep1,rl,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
                }
                else{
                  desg=ress3;
                  console.log(rl,dep1,desg)
                  res.render('insti/addstaff', {desg,rl,dep1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
                }
              })
             
            }
          })
      }

      
    })
    //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });


  router.post('/addstaff',async(req,res)=>{
    var res1=req.session.data
    var password=req.body.password
    console.log(req.body.password)
    var encryptpassword= await bcrypt.hash(password,saltRounds);
    console.log(encryptpassword)
    var type=2
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    const user=[[req.body.firstname,req.body.lastname,req.body.email,req.body.departmentid,req.body.designationid,req.body.roleid,req.body.mobile,req.body.doj,req.body.address,res1[0].institutionid,date,'active',res1[0].institutioncode,res1[0].institutioncode]]
    const louser=[[req.body.email,encryptpassword,type,res1[0].institutioncode,date,res1[0].institutionid,'active',res1[0].institutioncode]]
     var sql1="INSERT INTO staff (firstname,lastname,email,departmentid,designationid,roleid,mobile,doj,address,createdby,createddate,status,tenentid,institutioncode) VALUES ?"
     var sql="INSERT INTO login (username,password,type,tenentid,createddate,createdby,status,institutioncode) VALUES ?"
    db.query(sql1,[user],function (err,result){
        if(err) console.log(err)
        else{
          console.log("enterted to staff")
          db.query(sql,[louser],(err1,res1)=>{
            if(err1){console.log(err1); res.redirect("/inst/staffmain")}    
            else{
              console.log("Entry sucess")
              res.redirect("/inst/staffmain")
            }
          })
          
      }
        
    })
    
    
   
        
    }
  )
 router.get('/viewdepstaff/:id',verifyLogin, function(req, res, next) {
  depid=req.params.id
  req.session.kpi=depid;
  res.redirect('/inst/viewdepstaff')
 })


 router.get('/viewdepstaff',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  var depid=req.session.kpi
  console.log(depid)
  l=[[depid,instid]]
  var sql="SELECT staff.staffid,staff.firstname,staff.lastname,staff.email,staff.mobile,staff.doj, designation.name AS designationname,department.name AS departmentname,role.name AS rolename FROM staff INNER JOIN department ON staff.departmentid = department.departmentid INNER JOIN designation ON staff.designationid = designation.designationid INNER JOIN role ON staff.roleid = role.roleid WHERE staff.departmentid = ? AND staff.institutioncode=?;"
  db.query(sql,[depid,instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/viewdepstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/viewdepstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{console.log("nhbhbhbhb");res.render('insti/viewdepstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});

router.get('/academicyear',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  console.log(res1)
  var sql="select * from academicyear where status='active' and institutioncode=?"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/academicyear', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/academicyear', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/academicyear', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});

router.get('/addyear',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  res.render('insti/addyear', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});
router.post('/addyear',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.name,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO academicyear (name,tenentid,institutioncode,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to academic")
        res.redirect("/inst/academicyear")
        
    }
      
  })
      
  }
)


router.get('/class',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  console.log(res1)
  var sql="SELECT class.classname, academicyear.name AS academicyear,department.name as department FROM class INNER JOIN academicyear ON class.academicyearid = academicyear.academicyearid INNER JOIN department on class.departmentid=department.departmentid WHERE class.status = 'active' and class.institutioncode=?;"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/class', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/class', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/class', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});
router.get('/addclass',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  console.log(res1[0].companyid)
  console.log(instid)
  var sql="select * from academicyear where status='active'";
  db.query(sql,(err,ress1)=>{
    if(err){res.render('insti/addclass', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
    else{
        year=ress1;
        var sql1="select * from department where institutioncode= ?"
        db.query(sql1,[instid],(err1,ress2)=>{
          if(err1){console.log("error indepartment fetching");res.render('insti/addclass', {year,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
          else{
            dp=ress2
            res.render('insti/addclass',{dp,year,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
          }
        })
        
           
          
        }
    })

    
  
  //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/addclass',async(req,res)=>{
  var res1=req.session.data
  console.log(res1)
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.name,req.body.academicyearid,req.body.departmentid,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 console.log(user)
   var sql1="INSERT INTO class (classname,academicyearid,departmentid,tenentid,institutioncode,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to academic")
        res.redirect("/inst/class")
        
    }
      
  })
      
  }
)


router.get('/teacherclassmap',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  depid=req.session.kpi;
  console.log(depid)
  var instid=res1[0].institutioncode;
  var sql="SELECT teacherclassmapping.teacherid, teacherclassmapping.classid, staff.firstname, staff.lastname, class.classname FROM teacherclassmapping INNER JOIN staff ON staff.staffid = teacherclassmapping.teacherid INNER JOIN class ON class.classid = teacherclassmapping.classid where staff.departmentid=? and staff.institutioncode=?"
  db.query(sql,[depid,instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/teacherclassmap', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/teacherclassmap', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/teacherclassmap', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});
router.get('/assignclass/:id',verifyLogin, function(req, res, next) {
  depid=req.params.id
  req.session.kpi=depid;
  res.redirect('/inst/teacherclassmap')
 })

router.get('/mapteacherclass',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  depid=req.session.kpi
  console.log(depid)
  var instid=res1[0].institutioncode;
  var sql="select * from staff where status='active' and departmentid=? and institutioncode= ?";
  db.query(sql,[depid,instid],(err,ress1)=>{
    if(err){console.log('error1');res.render('insti/mapteacherclass', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
    else{
        staf=ress1;
        console.log(staf)
        var sql1="select * from class where departmentid=? and status='active'"
        db.query(sql1,[depid],(err1,ress2)=>{
          if(err1){console.log("error indepartment fetching");res.render('insti/mapteacherclass', {year,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
          else{
            clas=ress2
            console.log(clas)
            res.render('insti/mapteacherclass',{clas,staf,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
          }
        })
        
           
          
        }
    })

    
  
  //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.get('/classassign',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  var instid=res1[0].institutioncode;
  var sql="select * from department where institutioncode= ?"
  db.query(sql,[instid],(err,ress1)=>{
    if(err){console.log("Error in fetching department details");res.render('insti/classassign', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
    else{
      dep1=ress1
      res.render('insti/classassign', {dep1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
    }
  })
  //res.render(dep1,'insti/staffmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/mapteacherclass',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.classid,req.body.teacherid,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO teacherclassmapping (classid,teacherid,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to academic")
        res.redirect("/inst/teacherclassmap")
        
    }
      
  })
      
  }
)


router.get('/bus',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  var instid=res1[0].institutioncode;
  var sql="select * from vehicle where institutioncode =?"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/bus', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/bus', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/bus', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});

router.get('/addbus',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  res.render('insti/addbus', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/addbus',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.model,req.body.noofseat,req.body.regnumber,req.body.ownorrent,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO vehicle (model,noofseat,regnumber,ownorrent,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to vechicle")
        res.redirect("/inst/bus")
        
    }
      
  })
  
  
 
      
  }
)

router.get('/stop',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  var instid=res1[0].institutioncode;
  var sql="select * from stop where institutioncode =?"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/stop', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/stop', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/stop', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});

router.get('/addstop',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  res.render('insti/addstop', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/addstop',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.stopname,req.body.latitude,req.body.longitude,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO stop (stopname,latitude,longitude,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to stop")
        res.redirect("/inst/stop")
        
    }
      
  })
  
  
 
      
  }
)

router.get('/viewdriver',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  var depid=req.session.kpi
  console.log(depid)
 
  var sql="SELECT staff.staffid,staff.firstname,staff.lastname,staff.email,staff.mobile,staff.doj, designation.name AS designationname,role.name AS rolename FROM staff INNER JOIN designation ON staff.designationid = designation.designationid INNER JOIN role ON staff.roleid = role.roleid WHERE staff.roleid = 2 AND staff.institutioncode=?;"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/viewdrvier', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/viewdriver', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{console.log("nhbhbhbhb");res.render('insti/viewdriver', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
})




router.get('/route',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  var instid=res1[0].institutioncode;
  var sql="select * from route where institutioncode =?"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/route', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/route', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/route', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});

router.get('/addroute',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  res.render('insti/addroute', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/addroute',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.routename,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO route (routename,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to route")
        res.redirect("/inst/route")
        
    }
      
  })
  
  
 
      
  }
)

router.get('/trip',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  var instid=res1[0].institutioncode;
  var sql="select * from trip where institutioncode =?"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/trip', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/trip', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/trip', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});

router.get('/addtrip',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  console.log(res1[0].companyid)
  res.render('insti/addtrip', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});


router.post('/addtrip',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.tripname,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO trip (tripname,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to route")
        res.redirect("/inst/trip")
        
    }
      
  })
  }
)
// ----------------------------------------------------------------------------------------
router.get('/tripstopmap',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  depid=req.session.kpi;
  console.log(depid)
  var instid=res1[0].institutioncode;
  var sql="SELECT tripstopmap.onewaydailyrate, tripstopmap.twowaydailyrate, tripstopmap.onewaymonthlyrate, tripstopmap.twowaymonthlyrate, trip.tripname, stop.stopname, route.routename FROM tripstopmap INNER JOIN trip ON tripstopmap.tripid = trip.tripid INNER JOIN route  ON route.routeid = tripstopmap.routeid INNER JOIN stop ON stop.stopid = tripstopmap.stopid WHERE tripstopmap.institutioncode = ?;"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error");res.render('insti/tripstopmap', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/tripstopmap', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/tripstopmap', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});
// router.get('/assignclass/:id',verifyLogin, function(req, res, next) {
//   depid=req.params.id
//   req.session.kpi=depid;
//   res.redirect('/inst/teacherclassmap')
//  })

router.get('/maptripstop',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  depid=req.session.kpi
  console.log(depid)
  var instid=res1[0].institutioncode;
  var sql="select * from trip where status='active' and institutioncode= ?";
  db.query(sql,[instid],(err,ress1)=>{
    if(err){console.log('error1');res.render('insti/maptripstop', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
    else{
        trip=ress1;
        console.log(trip)
        var sql1="select * from route where institutioncode=? and status='active'"
        db.query(sql1,[instid],(err1,ress2)=>{
          if(err1){console.log("error indepartment fetching");res.render('insti/maptripstop', {trip,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
          else{
            route=ress2
            console.log(route)
            var sql3="Select * from stop where institutioncode=? and status ='active'";
            db.query(sql3,[instid],(err3,ress3)=>{
              if(err3){console.log("err in stop");res.render('insti/maptripstop',{trip,route,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
              else{
                stop=ress3;
                console.log(trip,stop,route)
                res.render('insti/maptripstop',{trip,route,stop,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
              }
            })
            // res.render('insti/mapteacherclass',{clas,staf,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
          }
        })
        
           
          
        }
    })

    
  
  //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});





router.post('/maptripstop',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.tripid,req.body.routeid,req.body.stopid,req.body.onewaydailyrate,req.body.twowaydailyrate,req.body.onewaymonthlyrate,req.body.twowaymonthlyrate,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
 
   var sql1="INSERT INTO tripstopmap (tripid,routeid,stopid,onewaydailyrate,twowaydailyrate,onewaymonthlyrate,twowaymonthlyrate,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        console.log("enterted to tripstopmap")
        res.redirect("/inst/tripstopmap")
        
    }
      
  })
      
  }
)

// ----------------------------------------------------------------------
router.get('/tripdriver',verifyLogin, function(req, res, next) {
  var res1=req.session.data
  console.log(res1)
  depid=req.session.kpi;
  console.log(depid)
  var instid=res1[0].institutioncode;
  var sql="SELECT drivertripmap.tripid, vehicletripmap.time, staff.firstname, staff.lastname, vehicle.regnumber, trip.tripname FROM drivertripmap INNER JOIN trip ON drivertripmap.tripid = trip.tripid INNER JOIN staff ON staff.staffid = drivertripmap.driverid INNER JOIN vehicle ON vehicle.vehicleid = (SELECT vehicletripmap.vehicleid FROM vehicletripmap WHERE vehicletripmap.tripid = drivertripmap.tripid) inner join vehicletripmap on vehicletripmap.tripid=drivertripmap.tripid WHERE drivertripmap.institutioncode = ? and drivertripmap.status='active';"
  db.query(sql,[instid],(err,res2)=>{
    if(err){console.log("database fetching error",err);res.render('insti/tripdriver', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    else {
      if(res2.length>0){
        dt=res2
        console.log(dt)
        res.render('insti/tripdriver', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
      }
      else{res.render('insti/tripdriver', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
    }

  })
  // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
});
// router.get('/assignclass/:id',verifyLogin, function(req, res, next) {
//   depid=req.params.id
//   req.session.kpi=depid;
//   res.redirect('/inst/teacherclassmap')
//  })

router.get('/assigndrivertrip',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  depid=req.session.kpi
  console.log(depid)
  var instid=res1[0].institutioncode;
  var sql="select * from trip where status='active' and institutioncode= ?";
  db.query(sql,[instid],(err,ress1)=>{
    if(err){console.log('error1');res.render('insti/assigndrivertrip', {res1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
    else{
        trip=ress1;
        console.log(trip)
        var sql1="select * from staff where institutioncode=? and status='active' and roleid=2"
        db.query(sql1,[instid],(err1,ress2)=>{
          if(err1){console.log("error indepartment fetching");res.render('insti/assigndrivertrip', {trip,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
          else{
            driver=ress2
            console.log(driver)
            var sql3="Select * from vehicle where institutioncode=? and status ='active'";
            db.query(sql3,[instid],(err3,ress3)=>{
              if(err3){console.log("err in stop");
              res.render('insti/assigndrivertrip',{trip,driver,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
              else{
                vehicle=ress3;
                console.log(trip,driver,vehicle)
                res.render('insti/assigndrivertrip',{trip,driver,vehicle,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
              }
            })
            // res.render('insti/mapteacherclass',{clas,staf,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
          }
        })
        
           
          
        }
    })

    
  
  //res.render('insti/addstaff', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});





router.post('/assigndrivertrip',async(req,res)=>{
  var res1=req.session.data
  
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var date = year + "-" + month + "-" + day;
  const user=[[req.body.tripid,req.body.driverid,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
  const user1=[[req.body.tripid,req.body.vehicleid,req.body.time,res1[0].institutioncode,res1[0].institutioncode,'active',date]]
   var sql1="INSERT INTO drivertripmap (tripid,driverid,institutioncode,tenentid,status,addeddate) VALUES ?"
   
  db.query(sql1,[user],function (err,result){
      if(err) console.log(err)
      else{
        //console.log(result)
        console.log("enterted to drivertripmap")
        var sql2="insert into vehicletripmap (tripid,vehicleid,time,institutioncode,tenentid,status,addeddate) VALUES ?"
        db.query(sql2,[user1],(err1,ress1)=>{
          if(err1){console.log("Error in vehicletripmap");res.redirect("/inst/tripdriver")}
          else{
            console.log("entred suced in vechiletripmap")
            res.redirect("/inst/tripdriver")
          }
        })
        //res.redirect("/inst/tripstopmap")
        
    }
      
  })
      
  }
)
// ----------------------------------------------------------------------------------------------------------------------
router.get('/busmain',verifyLogin,function(req, res, next) {
  var res1=req.session.data
  var instid=res1[0].institutioncode;
  console.log(res1[0].companyid)
  // var sql="select * from department where institutioncode=?"
  // db.query(sql,[instid],(err,ress1)=>{
  //   if(err){console.log("Error in fetching department details");
    res.render('insti/busmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  //   else{
  //     dep1=ress1
  //     res.render('insti/busmain', {dep1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  //   }
  // })
  //res.render(dep1,'insti/staffmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
});





  router.get('/Studentmain',verifyLogin,function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    console.log(res1[0].companyid)
     var sql="select * from department where institutioncode=?"
     db.query(sql,[instid],(err,ress1)=>{
      if(err){console.log("Error in fetching department details");
      res.render('insti/studentmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });}
       else{
         dep=ress1
         res.render('insti/studentmain', {dep,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
       }
     })
    //res.render(dep1,'insti/staffmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
  });

router.post("/depstudent",(req,res)=>{
  req.session.kpi=req.body.departmentid
  res.redirect("/inst/depstudent")
})
  router.get('/depstudent',verifyLogin, function(req, res, next) {
    var res1=req.session.data
    var instid=res1[0].institutioncode;
    var depid=req.session.kpi
    console.log(depid,instid)
    
    var sql="SELECT student.admissionnumber,student.studentid,student.firstname,student.lastname,student.email, student.phone,student.address,student.departmentid, department.name AS departmentname FROM student INNER JOIN department ON student.departmentid = department.departmentid WHERE student.departmentid = ? AND student.institutioncode = ?;"
    db.query(sql,[depid,instid],(err,res2)=>{
      if(err){console.log("database fetching error");res.render('insti/depstudent', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      else {
        if(res2.length>0){
          dt=res2
          console.log(dt)
          res.render('insti/depstudent', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,dt })
        }
        else{console.log("nhbhbhbhb");res.render('insti/depstudent', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 })}
      }
  
    })
    
    // res.render('superadmin/inst', {style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',p1:'../plugins/datatables-bs4/css/dataTables.bootstrap4.min.css',p2:'../plugins/datatables-responsive/css/responsive.bootstrap4.min.css',p3:'../plugins/datatables-buttons/css/buttons.bootstrap4.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1 });
  });



  // router.get('/profile',verifyLogin,function(req, res, next) {
  //   res1=req.session.data
  //   var instid=res1[0].institutioncode;
  //   var clas=res1[0].classid
  //   console.log(clas)
    
    
  //    res.render('insti/profile',{ inst:true,title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1
  //   })
  //   });
  
    router.get('/profile',verifyLogin,function(req, res, next) {
      var res1=req.session.data
      console.log(res1[0].companyid)
      res.render('insti/profile', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
    });

    router.post('/changeimage',(req,res)=>{
      res1=req.session.data
      console.log(req.files.image)
    
        let image=req.files.image
        image.mv('./public/profileimages/inst'+res1[0].institutionid+'.png')
        res.redirect("/inst/profile")
          
    })
    router.get("/changeimage",(req,res)=>{
      res1=req.session.data
     
          res.render('insti/uploadimage',{ insti:true,title: 'SecureBus',style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1})
    
        
    })

    router.get('/academics',verifyLogin,function(req, res, next) {
      var res1=req.session.data
      
      var instid=res1[0].institutioncode;
      console.log(res1[0].companyid)
      // var sql="select * from department where institutioncode=?"
      // db.query(sql,[instid],(err,ress1)=>{
      //   if(err){console.log("Error in fetching department details");
        res.render('insti/academics', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
      //   else{
      //     dep1=ress1
      //     res.render('insti/busmain', {dep1,inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
      //   }
      // })
      //res.render(dep1,'insti/staffmain', {inst:true,style:'../dist/css/adminlte.min.css',plug:'../plugins/overlayScrollbars/css/OverlayScrollbars.min.css',plug1:'../plugins/fontawesome-free/css/all.min.css',bodyclass:'hold-transition sidebar-mini layout-fixed',res1,p1:'',p2:'',p3:'' });
    });
module.exports = router;