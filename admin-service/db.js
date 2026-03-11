const { Pool } = require("pg");

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: {
  rejectUnauthorized: false
 }
});

pool.connect()
 .then(() => {
  console.log("Admin DB Connected");
 })
 .catch(err => {
  console.error("PostgreSQL error:", err.message);
 });

module.exports = {
 query: (text, params) => pool.query(text, params)
};
