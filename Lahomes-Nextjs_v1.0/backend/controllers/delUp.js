const db = require("../config/db");
const moment = require('moment');
const bcrypt=require("bcryptjs")




exports.delete = (req, res) => {
    const { unique_id } = req.body;
  
    if (!unique_id) {
      return res.status(400).json({ error: "unique_id is required" });
    }
  
    db.query(
      `SELECT 'admin' AS role FROM admin WHERE unique_id = ? 
       UNION 
       SELECT 'instructors' AS role FROM instructors WHERE unique_id = ? 
       UNION 
       SELECT 'students' AS role FROM students WHERE unique_id = ?`,
      [unique_id, unique_id, unique_id],
      (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Database error" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
  
        const role = results[0].role;
  
        if (role === "admin") {
   
          db.query(
            `DELETE FROM students WHERE instructor IN 
             (SELECT unique_id FROM instructors WHERE admin = ?)`,
            [unique_id],
            (err, studentResult) => {
              if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Error deleting students under admin" });
              }
  
              db.query(
                `DELETE FROM instructors WHERE admin = ?`,
                [unique_id],
                (err, instructorResult) => {
                  if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: "Error deleting instructors under admin" });
                  }
  
                  db.query(
                    `DELETE FROM admin WHERE unique_id = ?`,
                    [unique_id],
                    (err, adminResult) => {
                      if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json({ error: "Error deleting admin" });
                      }
                      res.json({ message: "Admin deleted", unique_id });
                    }
                  );
                }
              );
            }
          );
        } else if (role === "instructors") {
         
          db.query(
            `DELETE FROM students WHERE instructor = ?`,
            [unique_id],
            (err, studentResult) => {
              if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Error deleting students under instructor" });
              }
  
              db.query(
                `DELETE FROM instructors WHERE unique_id = ?`,
                [unique_id],
                (err, instructorResult) => {
                  if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: "Error deleting instructor" });
                  }
                  res.json({ message: "Instructor and students deleted", unique_id });
                }
              );
            }
          );
        } else if (role === "students") {
       
          db.query(
            `DELETE FROM students WHERE unique_id = ?`,
            [unique_id],
            (err, studentResult) => {
              if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Error deleting student" });
              }
              res.json({ message: "Student deleted", unique_id });
            }
          );
        }
      }
    );
};
  
  




exports.update = async (req, res) => {
  const { unique_id, name, email, password, group_name } = req.body;
  console.log("REQ.BODY:", req.body);
  const format = "DD-MM-YY"; // Note: Adjust to match DB expectations (e.g., "YYYY-MM-DD")
  const formattedDate = moment().format(format);

  try {
    // Validate unique_id
    if (!unique_id) {
      return res.status(400).json({ error: "unique_id is required" });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Define table-specific update queries
    const queryMap = {
      students: {
        query: `UPDATE students SET name = ?, email = ?, password = ?, group_name = ?, created_at = ? WHERE unique_id = ?`,
        values: [name, email, hashedPassword, group_name, formattedDate, unique_id],
      },
      instructors: {
        query: `UPDATE instructors SET name = ?, email = ?, password = ?, group_name = ?, created_at = ? WHERE unique_id = ?`,
        values: [name, email, hashedPassword, group_name, formattedDate, unique_id],
      },
      admin: {
        query: `UPDATE admin SET name = ?, email = ?, password = ?, created_at = ? WHERE unique_id = ?`,
        values: [name, email, hashedPassword, formattedDate, unique_id],
      },
    };

    // Check existence and update in one pass
    let targetTable = null;
    for (const [table, { query, values }] of Object.entries(queryMap)) {
      const [result] = await db.promise().query(query, values);
      if (result.affectedRows > 0) {
        targetTable = table;
        break; // Exit loop once a table is updated
      }
    }

    if (!targetTable) {
      return res.status(404).json({ error: "No record found with the provided unique_id" });
    }

    console.log(`Updated table: ${targetTable}`);
    res.json({ message: `Update successful`, unique_id, created_at: formattedDate });
  } catch (err) {
    console.error("Server Error:", err.code, err.sqlMessage, err.sql);
    res.status(500).json({ error: "Server error" });
  }
};