require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

/* -----------------------------
   ROOT
------------------------------ */

app.get("/", (req, res) => {
 res.send("Auth Service Running");
});

/* -----------------------------
   TEST DATABASE
------------------------------ */

app.get("/test-db", async (req, res) => {

 try{

  const result = await db.query("SELECT 1");

  res.json({
   message:"Database connected",
   result: result.rows
  });

 }catch(err){

  console.log("Database error:",err);

  res.status(500).json({
   message:"Database connection failed"
  });

 }

});

/* -----------------------------
   REGISTER USER
------------------------------ */

app.post("/register", async (req,res)=>{

 const {name,email,password} = req.body;

 if(!name || !email || !password){
  return res.status(400).json({
   message:"Name, email and password are required"
  });
 }

 try{

  /* CHECK EMAIL */

  const userCheck = await db.query(
   "SELECT * FROM users WHERE email=$1",
   [email]
  );

  if(userCheck.rows.length > 0){
   return res.status(400).json({
    message:"Email already exists"
   });
  }

  /* HASH PASSWORD */

  const hashedPassword = await bcrypt.hash(password,10);

  /* INSERT USER */

  await db.query(
   "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
   [name,email,hashedPassword]
  );

  res.json({
   message:"User registered successfully"
  });

 }catch(err){

  console.log(err);

  res.status(500).json({
   message:"Server error"
  });

 }

});

/* -----------------------------
   LOGIN USER
------------------------------ */

app.post("/login", async (req,res)=>{

 const {email,password} = req.body;

 if(!email || !password){
  return res.status(400).json({
   message:"Email and password required"
  });
 }

 try{

  const result = await db.query(
   "SELECT * FROM users WHERE email=$1",
   [email]
  );

  if(result.rows.length === 0){
   return res.status(401).json({
    message:"User not found"
   });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password,user.password);

  if(!match){
   return res.status(401).json({
    message:"Invalid password"
   });
  }

  /* CREATE JWT */

  const token = jwt.sign(
   {
    id:user.id,
    email:user.email
   },
   JWT_SECRET,
   {
    expiresIn:"1h"
   }
  );

  res.json({
   message:"Login successful",
   token
  });

 }catch(err){

  console.log(err);

  res.status(500).json({
   message:"Server error"
  });

 }

});

/* -----------------------------
   START SERVER
------------------------------ */

app.listen(PORT,()=>{
 console.log("Auth Service running on port " + PORT);
});
