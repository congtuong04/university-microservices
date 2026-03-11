require("dotenv").config();

const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

/* SERVICE STATUS */

app.get("/", (req,res)=>{
 res.json({message:"Student Service Running"});
});

/* GET ALL STUDENTS */

app.get("/students", async (req,res)=>{

 try{

  const sql = "SELECT * FROM students";

  const result = await db.query(sql);

  res.json(result.rows);

 }catch(err){

  res.status(500).json({error: err.message});

 }

});

/* CREATE STUDENT */

app.post("/", async (req,res)=>{

 const {name,email} = req.body;

 if(!name || !email){
  return res.status(400).json({message:"Missing fields"});
 }

 try{

  const sql = "INSERT INTO students (name,email) VALUES ($1,$2) RETURNING id";

  const result = await db.query(sql,[name,email]);

  res.json({
   message:"Student created",
   id: result.rows[0].id
  });

 }catch(err){

  res.status(500).json({error: err.message});

 }

});

/* UPDATE STUDENT */

app.put("/:id", async (req,res)=>{

 const {id} = req.params;
 const {name,email} = req.body;

 try{

  const sql = "UPDATE students SET name=$1, email=$2 WHERE id=$3";

  await db.query(sql,[name,email,id]);

  res.json({message:"Student updated"});

 }catch(err){

  res.status(500).json({error: err.message});

 }

});

/* DELETE STUDENT */

app.delete("/:id", async (req,res)=>{

 const {id} = req.params;

 try{

  const sql = "DELETE FROM students WHERE id=$1";

  await db.query(sql,[id]);

  res.json({message:"Student deleted"});

 }catch(err){

  res.status(500).json({error: err.message});

 }

});

/* START SERVER */

const PORT = process.env.PORT || 5002;

app.listen(PORT,()=>{

 console.log("Student Service running on port " + PORT);

});
