const db = require("../config/db");
const bcrypt = require("bcryptjs");
const moment = require('moment');



exports.post = async (req, res) => {
  const { name, email, password, role, group_name, unique_id,instructor } = req.body;
  const format = "DD-MM-YY";

  if (!["admin", "instructors", "students"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = Math.random().toString(36).substr(2, 6).toLowerCase();
    const formattedDate = moment().format(format);

    let query, values;

    if (role === "admin") {
      query = `INSERT INTO admin (unique_id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)`;
      values = [uniqueId, name, email, hashedPassword, formattedDate];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Admin registered successfully", role, uniqueId, created_at: formattedDate,name,password });
      });
    } 
    
    else if (role === "instructors") {
      if (!group_name || !req.body.admin) {
        return res.status(400).json({ error: "group_name and admin are required for instructors" });
      }

      query = `INSERT INTO instructors (unique_id, name, email, password, group_name, admin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      values = [uniqueId, name, email, hashedPassword, group_name, req.body.admin, formattedDate];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Instructor registered successfully", role, uniqueId, created_at: formattedDate });
      });
    } 
    
    else if (role === "students") {
      if (!group_name || !instructor) {
        return res.status(400).json({ error: "group_name and instructor are required for students" });
      }

      db.query(
        "SELECT admin, name, group_name FROM instructors WHERE unique_id = ?",
        [instructor],
        (err, results) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          if (results.length === 0) {
            return res.status(400).json({ error: "Instructor not found" });
          }

          const fetched_admin_unique_id = results[0].admin;
          const insname = results[0].name; 
          const insgroup_name = results[0].group_name; 

          query = `
            INSERT INTO students (unique_id, name, email, password, group_name, instructor, admin, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

          values = [uniqueId, name, email, hashedPassword, group_name, instructor, fetched_admin_unique_id, formattedDate];

          db.query(query, values, (err, result) => {
            if (err) {
              console.error("Database Error:", err);
              return res.status(500).json({ error: err.message });
            }

            res.json({
              message: "Student registered successfully",
              role,
              uniqueId,
              unique_id,
               name, 
               group_name,
              admin: fetched_admin_unique_id,
              created_at: formattedDate,
            });
          });
        }
      );
    }
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
