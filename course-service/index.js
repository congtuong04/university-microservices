require("dotenv").config();

const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

/* SERVICE STATUS */

app.get("/", (req,res)=>{
 res.json({message:"Course Service Running"});
});

/* GET ALL COURSES */

app.get("/courses", async (req,res)=>{

 try{

  const sql = "SELECT * FROM courses";

  const result = await db.query(sql);

  res.json(result.rows);

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* CREATE COURSE */

app.post("/courses", async (req,res)=>{

 const {title,description} = req.body;

 if(!title){
  return res.status(400).json({message:"Missing fields"});
 }

 try{

  const sql = `
   INSERT INTO courses (title,description)
   VALUES ($1,$2)
   RETURNING id
  `;

  const result = await db.query(sql,[title,description]);

  res.json({
   message:"Course created",
   id: result.rows[0].id
  });

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* UPDATE COURSE */

app.put("/courses/:id", async (req,res)=>{

 const {id} = req.params;
 const {title,description} = req.body;

 try{

  const sql = `
   UPDATE courses
   SET title=$1, description=$2
   WHERE id=$3
  `;

  await db.query(sql,[title,description,id]);

  res.json({message:"Course updated"});

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* DELETE COURSE */

app.delete("/courses/:id", async (req,res)=>{

 const {id} = req.params;

 try{

  const sql = "DELETE FROM courses WHERE id=$1";

  await db.query(sql,[id]);

  res.json({message:"Course deleted"});

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* START SERVER */

const PORT = process.env.PORT || 5004;

app.listen(PORT,()=>{

 console.log("Course Service running on port " + PORT);

});
