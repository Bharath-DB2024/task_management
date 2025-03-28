const mysql = require("mysql2");


const initialConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

initialConnection.query(`CREATE DATABASE IF NOT EXISTS task_management`, (err) => {
  if (err) {
    console.error("Error creating database:", err);
    process.exit(1);
  }
  console.log("Database checked/created successfully");
});


initialConnection.end();


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "task_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to task_management database");
});


module.exports = db;
