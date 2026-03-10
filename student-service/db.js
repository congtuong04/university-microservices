const mysql = require("mysql2");

let db;

function connectDB(){

 db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  ssl: {
    rejectUnauthorized: false
  }

 });

 db.connect((err)=>{

  if(err){
   console.log("Waiting for MySQL...", err.message);
   setTimeout(connectDB,3000);
   return;
  }

  console.log("Student DB Connected");

 });

}

connectDB();

module.exports = {
 query: (...args)=>db.query(...args)
};
