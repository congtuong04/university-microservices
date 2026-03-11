const { Pool } = require("pg");

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: {
  rejectUnauthorized: false
 }
});

pool.connect()
 .then(() => {
  console.log("Auth DB Connected");
 })
 .catch((err) => {
  console.error("PostgreSQL connection error:", err);
 });

module.exports = {
 query: (text, params) => pool.query(text, params)
};
