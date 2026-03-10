require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req,res)=>{
 res.send("Teacher Service Running");
});

/* GET ALL TEACHERS */

app.get("/teachers",(req,res)=>{

 const sql = "SELECT * FROM teachers";

 db.query(sql,(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json(result);

 });

});

/* CREATE TEACHER */

app.post("/teachers",(req,res)=>{

 const {name,email} = req.body;

 if(!name || !email){
  return res.status(400).json({message:"Missing fields"});
 }

 const sql = "INSERT INTO teachers (name,email) VALUES (?,?)";

 db.query(sql,[name,email],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Teacher created"});

 });

});

/* DELETE TEACHER */

app.delete("/teachers/:id",(req,res)=>{

 const {id} = req.params;

 const sql = "DELETE FROM teachers WHERE id=?";

 db.query(sql,[id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Teacher deleted"});

 });

});

app.listen(5004,()=>{
 console.log("Teacher Service running on port 5004");
});
