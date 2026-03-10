const mysql = require("mysql2");

let db;

function connectDB() {

  db = mysql.createConnection({
    host: process.env.DB_HOST || "auth-db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "auth_db",
    port: process.env.DB_PORT || 3306
  });

  db.connect((err) => {

    if (err) {
      console.log("MySQL connection failed:", err);
      setTimeout(connectDB, 3000);
      return;
    }

    console.log("MySQL Connected");

  });

  db.on("error", (err) => {
    console.log("MySQL error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connectDB();
    }
  });
}

connectDB();

module.exports = {
  query: (...args) => db.query(...args)
};
