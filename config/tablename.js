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
                var sql1="select * from studentfingermap where studentid= ?"
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
        var sql="select fingerid from studentfingermap where studentid=?";
        db.query(sql,[studentid],(err,ress)=>{
            if(err){
                console.log("error",err)
            }
                else
                {
                    if(ress.length==1)
                    {
                        delfingerid=ress;
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
                // var sql="select fingerid from studentfingermap where studentid=?";
                // db.query(sql,[studentid],(err,ress)=>{
                //     if(err){
                //         console.log("error",err);
                //         resolve(flase);
                //     }
                //         else
                //         {
                //             if(ress.length==1)
                //             {
                //                 delfingerid=ress;
                //                 resolve(delfingerid);
                //             }
                //         }
                    
                // })
                resolve(delfingerid);

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
}
