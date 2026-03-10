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
app.get("/test-db", (req, res) => {

  db.query("SELECT 1", (err, result) => {

    if (err) {
      console.log("Database error:", err);
      return res.status(500).json({ message: "Database connection failed" });
    }

    res.json({
      message: "Database connected",
      result
    });

  });

});

/* -----------------------------
   REGISTER USER
------------------------------ */
app.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  try {

    // kiểm tra email tồn tại
    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      async (err, result) => {

        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email already exists"
          });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user
        db.query(
          "INSERT INTO users (name,email,password) VALUES (?,?,?)",
          [name, email, hashedPassword],
          (err, result) => {

            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Database error" });
            }

            res.json({
              message: "User registered successfully"
            });

          }
        );

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

/* -----------------------------
   LOGIN USER
------------------------------ */
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }

      // tạo JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      res.json({
        message: "Login successful",
        token
      });

    }
  );

});

/* -----------------------------
   START SERVER
------------------------------ */
const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
 console.log("Auth Service running on port " + PORT);
});
