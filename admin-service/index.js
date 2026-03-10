require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

/* GET ALL ADMINS */

app.get("/", (req,res)=>{

 const sql = "SELECT * FROM admins";

 db.query(sql,(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json(result);

 });

});

/* CREATE ADMIN */

app.post("/",(req,res)=>{

 const {name,email} = req.body;

 if(!name || !email){
  return res.status(400).json({message:"Missing fields"});
 }

 const sql = "INSERT INTO admins (name,email) VALUES (?,?)";

 db.query(sql,[name,email],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({
   message:"Admin created",
   id: result.insertId
  });

 });

});

/* UPDATE ADMIN */

app.put("/:id",(req,res)=>{

 const {id} = req.params;
 const {name,email} = req.body;

 const sql = "UPDATE admins SET name=?, email=? WHERE id=?";

 db.query(sql,[name,email,id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Admin updated"});

 });

});

/* DELETE ADMIN */

app.delete("/:id",(req,res)=>{

 const {id} = req.params;

 const sql = "DELETE FROM admins WHERE id=?";

 db.query(sql,[id],(err,result)=>{

  if(err){
   return res.status(500).json(err);
  }

  res.json({message:"Admin deleted"});

 });

});

const PORT = process.env.PORT || 5005;

app.listen(PORT,()=>{
 console.log("Admin Service running on port " + PORT);
});
