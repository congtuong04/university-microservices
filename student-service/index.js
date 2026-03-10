require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

/* SERVICE STATUS */

app.get("/", (req,res)=>{
 res.send("Student Service Running");
});

/* GET ALL STUDENTS */

app.get("/students",(req,res)=>{

 const sql = "SELECT * FROM students";

 db.query(sql,(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json(result);

 });

});

/* CREATE STUDENT */

app.post("/students",(req,res)=>{

 const {name,email} = req.body;

 if(!name || !email){
  return res.status(400).json({message:"Missing fields"});
 }

 const sql = "INSERT INTO students (name,email) VALUES (?,?)";

 db.query(sql,[name,email],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Student created"});

 });

});

/* UPDATE STUDENT */

app.put("/students/:id",(req,res)=>{

 const {id} = req.params;
 const {name,email} = req.body;

 const sql = "UPDATE students SET name=?,email=? WHERE id=?";

 db.query(sql,[name,email,id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Student updated"});

 });

});

/* DELETE STUDENT */

app.delete("/students/:id",(req,res)=>{

 const {id} = req.params;

 const sql = "DELETE FROM students WHERE id=?";

 db.query(sql,[id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Student deleted"});

 });

});

const PORT = process.env.PORT || 5002;

app.listen(PORT,()=>{
 console.log("Student Service running on port " + PORT);
});
