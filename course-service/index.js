require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

/* GET ALL COURSES */

app.get("/", (req,res)=>{

 const sql = "SELECT * FROM courses";

 db.query(sql,(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json(result);

 });

});

/* CREATE COURSE */

app.post("/",(req,res)=>{

 const {name,credits} = req.body;

 if(!name || !credits){
  return res.status(400).json({message:"Missing fields"});
 }

 const sql = "INSERT INTO courses (name,credits) VALUES (?,?)";

 db.query(sql,[name,credits],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({
   message:"Course created",
   id: result.insertId
  });

 });

});

/* UPDATE COURSE */

app.put("/:id",(req,res)=>{

 const {id} = req.params;
 const {name,credits} = req.body;

 const sql = "UPDATE courses SET name=?, credits=? WHERE id=?";

 db.query(sql,[name,credits,id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Course updated"});

 });

});

/* DELETE COURSE */

app.delete("/:id",(req,res)=>{

 const {id} = req.params;

 const sql = "DELETE FROM courses WHERE id=?";

 db.query(sql,[id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Course deleted"});

 });

});

const PORT = process.env.PORT || 5003;

app.listen(PORT,()=>{
 console.log("Course Service running on port " + PORT);
});
