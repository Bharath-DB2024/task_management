const db = require("../config/db");
const moment = require('moment');
const CryptoJS = require("crypto-js");



const SECRET_KEY = "DB PRODUCTIONS"; 





exports.delete = (req, res) => {
  const { unique_id, task_id } = req.body;

  if (!unique_id && !task_id) {
      return res.status(400).json({ error: "Either unique_id or task_id is required" });
  }

  if (task_id) {
      db.query(
          `DELETE FROM task WHERE task_id = ?`,
          [task_id],
          (err, result) => {
              if (err) {
                  console.error("Database Error:", err);
                  return res.status(500).json({ error: "Error deleting task" });
              }

              if (result.affectedRows === 0) {
                  return res.status(404).json({ error: "Task not found" });
              }

              return res.json({ message: "Task deleted successfully", task_id });
          }
      );
      return; 
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
                  `DELETE FROM task WHERE student IN 
                   (SELECT unique_id FROM students WHERE instructor IN 
                    (SELECT unique_id FROM instructors WHERE admin = ?))`,
                  [unique_id],
                  (err) => {
                      if (err) {
                          console.error("Database Error:", err);
                          return res.status(500).json({ error: "Error deleting tasks under admin" });
                      }

                      db.query(
                          `DELETE FROM students WHERE instructor IN 
                           (SELECT unique_id FROM instructors WHERE admin = ?)`,
                          [unique_id],
                          (err) => {
                              if (err) {
                                  console.error("Database Error:", err);
                                  return res.status(500).json({ error: "Error deleting students under admin" });
                              }

                              db.query(
                                  `DELETE FROM instructors WHERE admin = ?`,
                                  [unique_id],
                                  (err) => {
                                      if (err) {
                                          console.error("Database Error:", err);
                                          return res.status(500).json({ error: "Error deleting instructors under admin" });
                                      }

                                      db.query(
                                          `DELETE FROM admin WHERE unique_id = ?`,
                                          [unique_id],
                                          (err) => {
                                              if (err) {
                                                  console.error("Database Error:", err);
                                                  return res.status(500).json({ error: "Error deleting admin" });
                                              }
                                              res.json({ message: "Admin Deleted", unique_id });
                                          }
                                      );
                                  }
                              );
                          }
                      );
                  }
              );
          } else if (role === "instructors") {
              db.query(
                  `DELETE FROM task WHERE student IN 
                   (SELECT unique_id FROM students WHERE instructor = ?)`,
                  [unique_id],
                  (err) => {
                      if (err) {
                          console.error("Database Error:", err);
                          return res.status(500).json({ error: "Error deleting tasks under instructor" });
                      }

                      db.query(
                          `DELETE FROM students WHERE instructor = ?`,
                          [unique_id],
                          (err) => {
                              if (err) {
                                  console.error("Database Error:", err);
                                  return res.status(500).json({ error: "Error deleting students under instructor" });
                              }

                              db.query(
                                  `DELETE FROM instructors WHERE unique_id = ?`,
                                  [unique_id],
                                  (err) => {
                                      if (err) {
                                          console.error("Database Error:", err);
                                          return res.status(500).json({ error: "Error deleting instructor" });
                                      }
                                      res.json({ message: "Instructor Deleted", unique_id });
                                  }
                              );
                          }
                      );
                  }
              );
          } else if (role === "students") {
              db.query(
                  `DELETE FROM task WHERE student = ?`,
                  [unique_id],
                  (err) => {
                      if (err) {
                          console.error("Database Error:", err);
                          return res.status(500).json({ error: "Error deleting tasks under student" });
                      }

                      db.query(
                          `DELETE FROM students WHERE unique_id = ?`,
                          [unique_id],
                          (err) => {
                              if (err) {
                                  console.error("Database Error:", err);
                                  return res.status(500).json({ error: "Error deleting student" });
                              }
                              res.json({ message: "Student Deleted", unique_id });
                          }
                      );
                  }
              );
          }
      }
  );
};



exports.update = async (req, res) => {
    const { unique_id, name, email, password, group_name, student_rank, reg_id, address } = req.body;
    const format = "DD-MM-YY"; 
    const formattedDate = moment().format(format);

    try {
        if (!unique_id) {
            return res.status(400).json({ error: "unique_id is required" });
        }

        let encryptedPassword = null;
        let encryptedRegId = null;
        let encryptedAddress = null;
        let decryptedPassword = null;
        let decryptedRegId = null;
        let decryptedAddress = null;

        const tables = ["students", "instructors", "admin"];
        let existingUser = null;
        let userTable = null;

        for (const table of tables) {
            const [rows] = await db.promise().query(
                `SELECT password ${table === "students" ? ", reg_id, address" : ""} FROM ${table} WHERE unique_id = ?`, 
                [unique_id]
            );

            if (rows.length > 0) {
                existingUser = rows[0];
                userTable = table;
                break;
            }
        }

        if (!existingUser) {
            return res.status(404).json({ error: "No record found with the provided unique_id" });
        }

        encryptedPassword = password 
            ? CryptoJS.AES.encrypt(password, SECRET_KEY).toString() 
            : existingUser.password;

        decryptedPassword = existingUser.password.startsWith("U2FsdGVkX1")
            ? CryptoJS.AES.decrypt(existingUser.password, SECRET_KEY).toString(CryptoJS.enc.Utf8)
            : existingUser.password;

        if (userTable === "students") {
         
            encryptedRegId = reg_id 
                ? CryptoJS.AES.encrypt(reg_id, SECRET_KEY).toString() 
                : existingUser.reg_id;
                
            encryptedAddress = address 
                ? CryptoJS.AES.encrypt(address, SECRET_KEY).toString() 
                : existingUser.address;

            decryptedRegId = existingUser.reg_id?.startsWith("U2FsdGVkX1")
                ? CryptoJS.AES.decrypt(existingUser.reg_id, SECRET_KEY).toString(CryptoJS.enc.Utf8)
                : existingUser.reg_id;

            decryptedAddress = existingUser.address?.startsWith("U2FsdGVkX1")
                ? CryptoJS.AES.decrypt(existingUser.address, SECRET_KEY).toString(CryptoJS.enc.Utf8)
                : existingUser.address;
        }

        const queryMap = {
            students: {
                query: `UPDATE students SET name = ?, email = ?, password = ?, student_rank = ?, group_name = ?, reg_id = ?, address = ?, created_at = ? WHERE unique_id = ?`,
                values: [name, email, encryptedPassword, student_rank, group_name, encryptedRegId, encryptedAddress, formattedDate, unique_id], 
            },
            instructors: {
                query: `UPDATE instructors SET name = ?, email = ?, password = ?, created_at = ? WHERE unique_id = ?`,
                values: [name, email, encryptedPassword, formattedDate, unique_id],
            },
            admin: {
                query: `UPDATE admin SET name = ?, email = ?, password = ?, created_at = ? WHERE unique_id = ?`,
                values: [name, email, encryptedPassword, formattedDate, unique_id],
            },
        };

        const { query, values } = queryMap[userTable];
        const [result] = await db.promise().query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Update failed, no changes were made" });
        }

        res.json({
            message: `Update successful`,
            unique_id,
            name,
            email,
            decryptedPassword,
            group_name,
            student_rank,
            decryptedRegId,
            decryptedAddress,
            created_at: formattedDate
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};




exports.updateTask = async (req, res) => {
    const { task_id, task_name, group_name, expiry_date } = req.body;
  
    if (!task_id) {
      return res.status(400).json({ error: "Task ID is required" });
    }
  
    try {
      const [taskResult] = await db.promise().query(
        "SELECT * FROM task WHERE task_id = ?",
        [task_id]
      );
  
      if (taskResult.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      const updatedFields = {};
      if (task_name) updatedFields.task_name = task_name;
      if (group_name) updatedFields.group_name = group_name;
      if (expiry_date) {
        updatedFields.expiry_date = moment(expiry_date, "DD-MM-YYYY").format("DD-MM-YYYY");
      }
  
      const setClause = Object.keys(updatedFields)
        .map((field) => `${field} = ?`)
        .join(", ");
      const queryParams = [...Object.values(updatedFields), task_id];
  
      if (setClause) {
        await db.promise().query(
          `UPDATE task SET ${setClause} WHERE task_id = ?`,
          queryParams
        );
  
        res.status(200).json({ message: "Task updated successfully" });
      } else {
        res.status(400).json({ error: "No fields to update provided" });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};
  
  


