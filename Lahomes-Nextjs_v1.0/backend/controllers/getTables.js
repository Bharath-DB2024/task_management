const db = require("../config/db");


exports.getAdmins = (req, res) => {

  db.query("SELECT * FROM admin", (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Error fetching admins" });
    }
    res.json(results);
  });
};


exports.getInstructors = (req, res) => {
  
  db.query("SELECT * FROM instructors", (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Error fetching instructors" });
    }
    res.json(results);
  });
};


exports.getStudents = (req, res) => {
 
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Error fetching students" });
    }
    res.json(results);
  });
};


