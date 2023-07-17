var mysql= require('mysql');
var connection =mysql.createConnection({
    // host : 'mainproject.cgppzxoux0qs.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'akhilsherin',
    port:3306,
    database:'securebus'
});
connection.connect(function(err){
    if(err){
        console.error('error connecing'+err.stack);
        return;
    }
    console.log("connected to DB");
});
module.exports=connection;
