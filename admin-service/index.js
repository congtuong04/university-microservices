require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req,res)=>{
 res.send("Admin Service Running");
});

/* GET ADMINS */

app.get("/admins",(req,res)=>{

 const sql = "SELECT * FROM admins";

 db.query(sql,(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json(result);

 });

});

/* CREATE ADMIN */

app.post("/admins",(req,res)=>{

 const {name,email} = req.body;

 if(!name || !email){
  return res.status(400).json({message:"Missing fields"});
 }

 const sql = "INSERT INTO admins (name,email) VALUES (?,?)";

 db.query(sql,[name,email],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Admin created"});

 });

});

app.listen(5005,()=>{
 console.log("Admin Service running on port 5005");
});
