import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 50,                     // max connections
  idleTimeoutMillis: 30000,    // close idle clients
  connectionTimeoutMillis: 10000, // return an error after 10 seconds if connection could not be established
});

// test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connection Tested successfully");
  }
  release();
});

// Good practice: export query instead of entire pool
const query = (text, params) => pool.query(text, params);

export default { query, pool };