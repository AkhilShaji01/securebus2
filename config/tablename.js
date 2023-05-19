const { response, getMaxListeners } = require('../app')
var db = require('../config/connection')
var studentid="";
var rfid=false;
var pc=false;
var sta="";
var instid="";
var finger=false;
var delfinger=false;
var delfingerid=""
var express = require('express');
var router = express.Router();
module.exports={
    addrfidft:(sid)=>{
        rfid=true;
        studentid=dt.sid;
        instid=dt.instid;
        return new Promise((resolve,reject)=>{
            let saved=true;
            resolve(saved)
            
        })
    },
    addfingert:(sid)=>{
        finger=true;
        studentid=sid;
        //instid=dt.instid;
        //console.log(studentid,instid)
        return new Promise((resolve,reject)=>{
            let saved=true;
            resolve(saved)
            
        })
    },
    addrfidnd:()=>{
            return new Promise((resolve,reject)=>{
                if(rfid==true){
                resolve(studentid);}
                else{
                    resolve(false);
                }
                
            })
    },
    addrfidnd1:(c)=>{
        return new Promise((resolve,reject)=>{
            var date_ob = new Date();
            var day = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();
            var date = year + "-" + month + "-" + day;
            if(rfid==true){
                var sql1="select * from studentrfidmap where studentid= ?"
                db.query(sql1,[studentid],(err1,ress1)=>{
                    if(err1){console.log(err1);
                    resolve(false);
                    pc=true;
                    sta="error in executing db query"
                }
                    else{
                        if(ress1.length>0)
                        {
                            var n="already added";
                            rfid=false;
                            studentid=""
                            instid="";
                            resolve(n);
                            pc=true;
                            sta="The student is already assigned to a rfid card"
                            
                        }
                        else
                        {
                            var dt=[[studentid,c.cardid,c.institutioncode,'active',date]]
                            var sql="insert into studentrfidmap (studentid, rfidid, institutioncode,status, addeddate) values ?"
                            db.query(sql,[dt],(err,ress)=>{
                            if(err){console.log(err);
                                n=false;
                                resolve(n);
                                rfid=false;
                                studentid="";
                                instid="";
                                pc=true;
                                sta="error in executing db query"
                            }
                            else{
                                n=true;
                                resolve(n);
                                rfid=false;
                                studentid=""
                                instid="";
                                pc=true;
                                sta="RFID card saved added"
                            }
                            })
                        }
                    }
                })
                
            }
                else{
                        resolve(false);
                        pc=true;
                    }
                    
         })
    },
    rmrfid:()=>{
                studentid="";
                rfid=flase;
                instid="";
                return new Promise((resolve,reject)=>{
                    let done=true;
                    resolve(done);
                    
                })
            
        },
        tcpg:()=>{
            return new Promise((resolve,reject)=>{
                if(pc==true){
                    resolve(sta);
                    pc=false;
                    sta="";
                }
                else{
                resolve(false);}
                
            })
            
        },
        redir:()=>{
            router.redirect("/teacher/student");
        },

        addfinger:()=>{
            return new Promise((resolve,reject)=>{
                if(finger==true){
                resolve(studentid);}
                else{
                    resolve(false);
                }
                
            })
    },
    confirmfinger:(c)=>{
        return new Promise((resolve,reject)=>{
            var date_ob = new Date();
            var day = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();
            var date = year + "-" + month + "-" + day;
            if(finger==true){
                var sql1="select * from studentfingermap where studentid= ? and status='active'"
                db.query(sql1,[studentid],(err1,ress1)=>{
                    if(err1){console.log(err1);
                    resolve(false);
                    pc=true;
                    sta="error in executing db query"
                }
                    else{
                        if(ress1.length>0)
                        {
                            var n="already added";
                            finger=false;
                            studentid=""
                            instid=""
                            resolve(n);
                            pc=true;
                            sta="Fingerprint of the student already added"
                            
                        }
                        else
                        {
                            var dt=[[studentid,parseInt(c.fingerid),c.busid,c.institutioncode,'active',date]]
                            var sql="insert into studentfingermap (studentid, fingerid,vehicleid, institutioncode,status, addeddate) values ?"
                            db.query(sql,[dt],(err,ress)=>{
                            if(err){console.log(err);
                                n=false;
                                resolve(n);
                                finger=false;
                                studentid="";
                                instid="";
                                pc=true;
                                sta="error in executing db query"
                            }
                            else{
                                n=true;
                                resolve(n);
                                finger=false;
                                studentid="";
                                instid="";
                                pc=true;
                                sta="fingerprint added succesfullt"
                            }
                            })
                        }
                    }
                })
                
            }
                else{
                        resolve(false);
                        pc=true;
                    }
                    
        })
    },

    askfingerid:(c)=>{
        return new Promise((resolve,reject)=>{
            var vehicleid=c.busid;
            var instid1=c.institutioncode;
        //     var sql="select fingerid from studentfingermap where vehicleid=? and institutioncode=?";
        //     db.query(sql,[vehicleid,instid1],(err,ress)=>{
        //         if(err){console.log(err);resolve("error");}
        //         else
        //         {   var fingerid=-1;
        //             if(ress.length>0)
        //             { 
                        
        //                 var len=ress.length;
        //                 conress[0].fingerid
        //                 for (let i = 0,j=0; i < len; i++) {
        //                     if(ress[i].fingerid != j)
        //                     {
        //                         console.log(ress[i].fingerid,"dtfghjkldfgyhu");
        //                         fingerid=i;
        //                         break;
        //                     }
        //                     j++;
        //                 }
        //                 if(fingerid==-1)
        //                 {
        //                     fingerid=ress[len]+1;
        //                 }
        //             }
        //             else
        //             {
        //                 fingerid=1
        //             }
        //             resolve(fingerid)
        //         }
        //     })
            
        // })
        var sql="select fingerid from studentfingermap where vehicleid=? and institutioncode=?";
        db.query(sql,[vehicleid,instid1],(err,ress)=>{
            if(err){console.log(err);
                var fingerid1="error";resolve(fingerid1);}
            else
            {   var fingerid=-1;
              //console.log(ress.length)
                if(ress.length>0)
                { 
                    var len=parseInt(ress.length);
                    //console.log (ress[0].fingerid)
                    var w=len-1;
                    var fingeridprev=ress[w].fingerid;
                    fingerid=fingeridprev+1;
                }
                else
                {
                    fingerid=0;
                }
                console.log(fingerid)
                resolve(parseInt(fingerid))
            }
            }) 
    })
 
    },
    delfingert:(sid)=>{
        delfinger=true;
        studentid=sid;
        var sql="select fingerid from studentfingermap where studentid=? and status='active'";
        db.query(sql,[studentid],(err,ress)=>{
            if(err){
                console.log("error",err)
            }
                else
                {
                    if(ress.length==1)
                    {
                        delfingerid=ress[0].fingerid;
                        console.log(delfingerid)
                    }
                }
            
        })
        //instid=dt.instid;
        //console.log(studentid,instid)
        return new Promise((resolve,reject)=>{
            let saved=true;
            resolve(saved)
            
        })
    },
    checktodeletefinger:()=>{
        return new Promise((resolve,reject)=>{
            //delfinger=true;
            if(delfinger==true){
                var sql="select fingerid from studentfingermap where studentid=?";
                db.query(sql,[studentid],(err,ress)=>{
                    if(err){
                        console.log("error",err);
                        resolve(flase);
                    }
                        else
                        {
                            if(ress.length>0)
                            {
                                var sql1="update studentfingermap set status='deleted' where studentid=? and fingerid=?"
                                db.query(sql1,[studentid,delfingerid],(err1,ress1)=>{
                                    if(err1){console.log(err1)}
                                    {
                                        resolve(delfingerid);
                                        delfinger=false
                                    }
                                })
                            }
                        }
                    
                })
                

            //resolve(delfingerid);}
            }
            else{
                resolve(false);
            }
            
        })


},
askfingerid1:(c)=>{
    return new Promise((resolve,reject)=>{
        var vehicleid=c.busid;
        var instid1=c.institutioncode;
        delfinger=0;
        resolve(delfingerid);
        // var sql="select fingerid from studentfingermap where vehicleid=? and institutioncode=?";
        // db.query(sql,[vehicleid,instid1],(err,ress)=>{
        //     if(err){console.log(err);resolve("error");}
        //     else
        //     {   var fingerid=0;
        //         if(ress.length>0)
        //         {
                    
        //             var len=ress.length;
        //             for (let i = 0,j=0; i < len; i++,j++) {
        //                 if(ress[i]!=j)
        //                 {
        //                     fingerid=i;
        //                     break;
        //                 }
        //             }
        //             if(fingerid==0)
        //             {
        //                 fingerid=ress[len]+1;
        //             }
        //         }
        //         else
        //         {
        //             fingerid=1
        //         }
        //         resolve(fingerid)
        //     }
        // })
        
    })

},
dailyrfid:(c)=>{
    return new Promise((resolve,reject)=>{
        var fingerid1=false;
        var cardid=c.cardid;
        var instid1=c.institutioncode;
        var busid=c.busid;
        var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var date = year + "-" + month + "-" + day;
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var time=hours+":"+minutes+":"+seconds;
        var sql="select studentid from studentrfidmap where rfidid=? and institutioncode=?";
        db.query(sql,[cardid,instid1],(err,ress)=>{
            if(err){console.log(err);
                var fingerid1="error";resolve(fingerid1);}
            else
            {  if(ress.length>0)
                { 
                    var stunid=ress[0].studentid;
                    var sql1="select tripid from studenttripmap where studentid=? and institutioncode=?";
                    db.query(sql1,[stunid,instid1],(err1,ress1)=>{
                        if(err1){console.log(err1);resolve(fingerid1);}
                        else{
                            if(ress1.length>0){
                                var tripid=ress1[0].tripid;
                                console.log(tripid);
                                var vehicid="";
                                var sql_1="select vehicleid from vehicletripmap where tripid=?"
                                db.query(sql_1,[tripid],(err_1,ress_1)=>{
                                    if(err_1){console.log(err_1);}
                                    else{
                                        if(ress_1.length>0)
                                        {
                                            vehicid=ress_1[0].vehicleid;
                                        }
                                    }
                                })
                                var sql2="select dailystudentid from dailystudent where studentid=? and date=? and institutioncode=?";
                                db.query(sql2,[stunid,date,instid1],(err2,ress2)=>{
                                    if(err2){console.log(err2);resolve(fingerid1)}
                                    else
                                    {
                                        var len1=ress2.length;
                                        var latitude;
                                        var longitude;
                                        if(parseInt(len1)%2==0)
                                        {
                                            var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                            db.query(sql3,[busid,date],(err3,ress3)=>{
                                                if(err3){
                                                    console.log(err3);
                                                    resolve(fingerid1)
                                                }
                                                else
                                                {
                                                    latitude=ress3[0].latitude;
                                                    longitude=ress3[0].longitude;
                                                    console.log(latitude,longitude);
                                                }
                                            })
                                            var user1=[[stunid,tripid,busid,vehicid,"rfid","punch in",date,time, latitude,longitude,instid1,"active"]]
                                            var sql4="INSERT INTO dailystudent (studentid, tripid, vehicleid,assignedvehicleid, punchby, punchinout, date,time, latitude, longitude, institutioncode, status) VALUES ? "
                                            db.query(sql4,[user1],(err4,ress4)=>{
                                                if(err4){
                                                    console.log(err4);
                                                    resolve(fingerid1)
                                                }
                                                else{
                                                    var s="entered"
                                                    resolve(s);
                                                }
                                            })
                                        }
                                        else
                                        {
                                            {
                                                var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                                db.query(sql3,[busid,date],(err3,ress3)=>{
                                                    if(err3){
                                                        console.log(err3);
                                                        resolve(fingerid1)
                                                    }
                                                    else
                                                    {
                                                        latitude=ress3[0].latitude;
                                                        longitude=ress3[0].longitude;
                                                        console.log(latitude,longitude);
                                                    }
                                                })
                                                var user1=[[stunid,tripid,busid,"rfid","punch out",date,time, latitude,longitude,instid1,"active"]]
                                                var sql4="insert into dailystudent (studentid,tripid,vehicleid,punchby,punchinout,date,time,latitude,longitude,institutioncode,status) values?"
                                                db.query(sql4,[user1],(err4,ress4)=>{
                                                    if(err4){
                                                        console.log(err4);
                                                        resolve(fingerid1)
                                                    }
                                                    else{
                                                        var s="goodbye"
                                                        resolve(s);
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    
                                })
                            }
                            else
                            {
                                var sql2="select dailystudentid from dailystudent where studentid=? and date=? and institutioncode=?";
                                db.query(sql2,[stunid,date,instid1],(err2,ress2)=>{
                                    if(err2){console.log(err2);resolve(fingerid1)}
                                    else
                                    {
                                        var len1=ress2.length;
                                        var latitude;
                                        var longitude;
                                        if(parseInt(len1)%2==0)
                                        {
                                            var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                            db.query(sql3,[busid,date],(err3,ress3)=>{
                                                if(err3){
                                                    console.log(err3);
                                                    resolve(fingerid1)
                                                }
                                                else
                                                {
                                                    latitude=ress3[0].latitude;
                                                    longitude=ress3[0].longitude;
                                                    console.log(latitude,longitude);
                                                }
                                            })
                                            var user1=[[stunid,busid,"rfid","punch in",date,time, latitude,longitude,instid1,"active"]]
                                            var sql4="INSERT INTO dailystudent (studentid, vehicleid, punchby, punchinout, date,time, latitude, longitude, institutioncode, status) VALUES ? "
                                            db.query(sql4,[user1],(err4,ress4)=>{
                                                if(err4){
                                                    console.log(err4);
                                                    resolve(fingerid1)
                                                }
                                                else{
                                                    var s="entered"
                                                    resolve(s);
                                                }
                                            })
                                        }
                                        else
                                        {
                                            {
                                                var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                                db.query(sql3,[busid,date],(err3,ress3)=>{
                                                    if(err3){
                                                        console.log(err3);
                                                        resolve(fingerid1)
                                                    }
                                                    else
                                                    {
                                                        latitude=ress3[0].latitude;
                                                        longitude=ress3[0].longitude;
                                                        console.log(latitude,longitude);
                                                    }
                                                })
                                                var user1=[[stunid,busid,"rfid","punch out",date,time, latitude,longitude,instid1,"active"]]
                                                var sql4="insert into dailystudent (studentid,vehicleid,punchby,punchinout,date,time,latitude,longitude,institutioncode,status) values?"
                                                db.query(sql4,[user1],(err4,ress4)=>{
                                                    if(err4){
                                                        console.log(err4);
                                                        resolve(fingerid1)
                                                    }
                                                    else{
                                                        var s="goodbye"
                                                        resolve(s);
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    
                                })
                                        
                            }
                        }
                    })
                }
                else
                {
                    resolve(fingerid1)
                }
                
            }
            }) 
         })

},
dailyfinger:(c)=>{
    return new Promise((resolve,reject)=>{
        var fingerid1=false;
        var cardid=c.fingerid;
        var instid1=c.institutioncode;
        var busid=c.busid;
        var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var date = year + "-" + month + "-" + day;
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var time=hours+":"+minutes+":"+seconds;
        var sql="select studentid from studentfingermap where fingerid=? and institutioncode=? and status='active'";
        db.query(sql,[cardid,instid1],(err,ress)=>{
            if(err){console.log(err);
                var fingerid1="error";resolve(fingerid1);}
            else
            {  if(ress.length>0)
                { 
                    var stunid=ress[0].studentid;
                    var sql1="select tripid from studenttripmap where studentid=? and institutioncode=?";
                    db.query(sql1,[stunid,instid1],(err1,ress1)=>{
                        if(err1){console.log(err1);resolve(fingerid1);}
                        else{
                            if(ress1.length>0){
                                var tripid=ress1[0].tripid;
                                console.log(tripid);
                                var vehicid="";
                                var sql_1="select vehicleid from vehicletripmap where tripid=?"
                                db.query(sql_1,[tripid],(err_1,ress_1)=>{
                                    if(err_1){console.log(err_1);}
                                    else{
                                        if(ress_1.length>0)
                                        {
                                            vehicid=ress_1[0].vehicleid;
                                        }
                                    }
                                })
                                var sql2="select dailystudentid from dailystudent where studentid=? and date=? and institutioncode=?";
                                db.query(sql2,[stunid,date,instid1],(err2,ress2)=>{
                                    if(err2){console.log(err2);resolve(fingerid1)}
                                    else
                                    {
                                        var len1=ress2.length;
                                        var latitude;
                                        var longitude;
                                        if(parseInt(len1)%2==0)
                                        {
                                            var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                            db.query(sql3,[busid,date],(err3,ress3)=>{
                                                if(err3){
                                                    console.log(err3);
                                                    resolve(fingerid1)
                                                }
                                                else
                                                {
                                                    latitude=ress3[0].latitude;
                                                    longitude=ress3[0].longitude;
                                                    console.log(latitude,longitude);
                                                }
                                            })
                                            var user1=[[stunid,tripid,busid,vehicid,"fingerprint","punch in",date,time, latitude,longitude,instid1,"active"]]
                                            var sql4="INSERT INTO dailystudent (studentid, tripid, vehicleid,assignedvechileid, punchby, punchinout, date, time,latitude, longitude, institutioncode, status) VALUES ? "
                                            db.query(sql4,[user1],(err4,ress4)=>{
                                                if(err4){
                                                    console.log(err4);
                                                    resolve(fingerid1)
                                                }
                                                else{
                                                    var s="entered"
                                                    resolve(s);
                                                }
                                            })
                                        }
                                        else
                                        {
                                            {
                                                var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                                db.query(sql3,[busid,date],(err3,ress3)=>{
                                                    if(err3){
                                                        console.log(err3);
                                                        resolve(fingerid1)
                                                    }
                                                    else
                                                    {
                                                        latitude=ress3[0].latitude;
                                                        longitude=ress3[0].longitude;
                                                        console.log(latitude,longitude);
                                                    }
                                                })
                                                var user1=[[stunid,tripid,busid,vehicid,"fingerprint","punch out",date,time, latitude,longitude,instid1,"active"]]
                                                var sql4="insert into dailystudent (studentid,tripid,vehicleid,assignedvechileid,punchby,punchinout,date,time,latitude,longitude,institutioncode,status) values?"
                                                db.query(sql4,[user1],(err4,ress4)=>{
                                                    if(err4){
                                                        console.log(err4);
                                                        resolve(fingerid1)
                                                    }
                                                    else{
                                                        var s="goodbye"
                                                        resolve(s);
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    
                                })
                            }
                            else
                            {
                                var sql2="select dailystudentid from dailystudent where studentid=? and date=? and institutioncode=?";
                                db.query(sql2,[stunid,date,instid1],(err2,ress2)=>{
                                    if(err2){console.log(err2);resolve(fingerid1)}
                                    else
                                    {
                                        var len1=ress2.length;
                                        var latitude;
                                        var longitude;
                                        if(parseInt(len1)%2==0)
                                        {
                                            var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                            db.query(sql3,[busid,date],(err3,ress3)=>{
                                                if(err3){
                                                    console.log(err3);
                                                    resolve(fingerid1)
                                                }
                                                else
                                                {
                                                    latitude=ress3[0].latitude;
                                                    longitude=ress3[0].longitude;
                                                    console.log(latitude,longitude);
                                                }
                                            })
                                            var user1=[[stunid,busid,"fingerprint","punch in",date,time, latitude,longitude,instid1,"active"]]
                                            var sql4="INSERT INTO dailystudent (studentid, vehicleid, punchby, punchinout, date, time, latitude, longitude, institutioncode, status) VALUES ? "
                                            db.query(sql4,[user1],(err4,ress4)=>{
                                                if(err4){
                                                    console.log(err4);
                                                    resolve(fingerid1)
                                                }
                                                else{
                                                    var s="entered"
                                                    resolve(s);
                                                }
                                            })
                                        }
                                        else
                                        {
                                            {
                                                var sql3="select * from vehiclelivelocation where vehicleid=? and date=?";
                                                db.query(sql3,[busid,date],(err3,ress3)=>{
                                                    if(err3){
                                                        console.log(err3);
                                                        resolve(fingerid1)
                                                    }
                                                    else
                                                    {
                                                        latitude=ress3[0].latitude;
                                                        longitude=ress3[0].longitude;
                                                        console.log(latitude,longitude);
                                                    }
                                                })
                                                var user1=[[stunid,busid,"finger","punch out",date, time,latitude,longitude,instid1,"active"]]
                                                var sql4="insert into dailystudent (studentid,vehicleid,punchby,punchinout,date,time,latitude,longitude,institutioncode,status) values?"
                                                db.query(sql4,[user1],(err4,ress4)=>{
                                                    if(err4){
                                                        console.log(err4);
                                                        resolve(fingerid1)
                                                    }
                                                    else{
                                                        var s="goodbye"
                                                        resolve(s);
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    
                                })
                                        
                            }
                        }
                    })
                }
                else
                {
                    resolve(fingerid1)
                }
                
            }
            }) 
         })

},
livelocation:(data)=>{
    console.log(data);
    var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var date = year + "-" + month + "-" + day;
        var busid=data.busid
        var insti=data.institutioncode;
        var latitude=data.latitude;
        console.log(latitude)
        
        var longitude=data.longitutude;
        console.log(longitude)
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var time=hours+":"+minutes+":"+seconds;
    return new Promise((resolve,reject)=>{
        var sql="select * from vehiclelivelocation where vehicleid=? and date=?"
        db.query(sql,[busid,date],(err,ress)=>{
            if(err){console.log(err);resolve(false)}
            else
            {
                if(ress.length>0)
                {
                

                    var sql2="UPDATE vehiclelivelocation SET latitude = ?, longitude = ?, time = ? WHERE institutioncode = ? AND vehicleid = ? AND date = ?";
                    db.query(sql2,[latitude,longitude,time,insti,busid,date],(err1,ress1)=>{
                        if(err1){console.log(err1);resolve(false) }
                        else
                        {
                            var re="entred"
                            console.log("cgvhbjnmk")
                            resolve(re);
                        }
                    })
                }
                else
                {
                    var user=[[busid,latitude,longitude,insti,date,time]];
                    var sql3="insert into vehiclelivelocation (vehicleid,latitude,longitude,institutioncode,date,time) values ?"
                    db.query(sql3,[user],(err2,ress2)=>{
                        if(err2){console.log(err2);resolve(false)}
                        else
                        {
                            console.log("entred")
                            var re="entred"
                            resolve(re);
                        }
                    })
                }
            }
        })
        
    })
    
},

}
