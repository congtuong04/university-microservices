require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

/* GET ALL ADMINS */

app.get("/", async (req,res)=>{

 try{

  const sql = "SELECT * FROM admins";

  const result = await db.query(sql);

  res.json(result.rows);

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* CREATE ADMIN */

app.post("/", async (req,res)=>{

 const {name,email} = req.body;

 if(!name || !email){
  return res.status(400).json({message:"Missing fields"});
 }

 try{

  const sql = "INSERT INTO admins (name,email) VALUES ($1,$2) RETURNING id";

  const result = await db.query(sql,[name,email]);

  res.json({
   message:"Admin created",
   id: result.rows[0].id
  });

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* UPDATE ADMIN */

app.put("/:id", async (req,res)=>{

 const {id} = req.params;
 const {name,email} = req.body;

 try{

  const sql = "UPDATE admins SET name=$1, email=$2 WHERE id=$3";

  await db.query(sql,[name,email,id]);

  res.json({message:"Admin updated"});

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

/* DELETE ADMIN */

app.delete("/:id", async (req,res)=>{

 const {id} = req.params;

 try{

  const sql = "DELETE FROM admins WHERE id=$1";

  await db.query(sql,[id]);

  res.json({message:"Admin deleted"});

 }catch(err){

  res.status(500).json({error:err.message});

 }

});

const PORT = process.env.PORT || 5005;

app.listen(PORT,()=>{
 console.log("Admin Service running on port " + PORT);
});
