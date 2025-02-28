const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", 
  database: "task_management",  
});

db.connect((err) => {
  if (err) {
    console.error(" Database connection failed:", err);
    process.exit(1);  
  }
  console.log("Database Connected");
});

module.exports = db;
