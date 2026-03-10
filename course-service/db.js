const mysql = require("mysql2");

let db;

function connectDB(){

 db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "course_db",
  port: process.env.DB_PORT || 3306
 });

 db.connect((err)=>{

  if(err){
   console.log("Waiting for MySQL...");
   setTimeout(connectDB,3000);
   return;
  }

  console.log("Course DB Connected");

 });

}

connectDB();

module.exports = {
 query: (...args)=>db.query(...args)
};
