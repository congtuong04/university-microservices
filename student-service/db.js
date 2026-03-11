const { Pool } = require("pg");

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
 ssl: {
  rejectUnauthorized: false
 }
});

pool.connect((err, client, release) => {

 if(err){
  console.log("PostgreSQL error:", err.message);
  console.log("Waiting for PostgreSQL...");
  setTimeout(()=>process.exit(1),3000);
  return;
 }

 console.log("Student DB Connected");
 release();

});

module.exports = {
 query: (text, params) => pool.query(text, params)
};
