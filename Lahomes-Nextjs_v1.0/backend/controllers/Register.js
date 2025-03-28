const moment = require("moment");
const cryptoJS = require("crypto-js");
const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');



const secretKey = "DB PRODUCTIONS"; 
const format = "DD-MM-YY";

exports.post = async (req, res) => {
  const { name, email, password, group_name, instructor, admin, student_rank, reg_id, address } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const encryptedPassword = cryptoJS.AES.encrypt(password, secretKey).toString();
    const uniqueId = uuidv4();
    const formattedDate = moment().format(format);
    let query, values, role;

    if (!admin && !instructor && !group_name) {
   
      role = "admin";
      query = `INSERT INTO admin (unique_id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)`;
      values = [uniqueId, name, email, encryptedPassword, formattedDate];

    } else if (admin && !instructor && !group_name) {
  
      role = "instructors";
      query = `INSERT INTO instructors (unique_id, name, email, password, admin, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
      values = [uniqueId, name, email, encryptedPassword, admin, formattedDate];

    } else if (instructor && group_name) {
  
      db.query("SELECT admin FROM instructors WHERE unique_id = ?", [instructor], (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: "Instructor not found" });
        }

        const fetched_admin_unique_id = results[0].admin;

        const encryptedRegId = reg_id ? cryptoJS.AES.encrypt(reg_id, secretKey).toString() : null;
        const encryptedAddress = address ? cryptoJS.AES.encrypt(address, secretKey).toString() : null;

        const studentQuery = `INSERT INTO students (unique_id, name, email, password, group_name,student_rank, reg_id, address, instructor, admin, created_at) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const studentValues = [uniqueId, name, email, encryptedPassword, group_name, student_rank, encryptedRegId, encryptedAddress, instructor, fetched_admin_unique_id, formattedDate];

        db.query(studentQuery, studentValues, (err) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
          }
          res.json({
            message: "Student registered",
            role: "students",
            uniqueId,
            name,
            group_name,
            admin: fetched_admin_unique_id,
            created_at: formattedDate,
          });
        });
      });
      return;
    } else {
      return res.status(400).json({ error: "Invalid request data" });
    }


    db.query(query, values, (err) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Registration Successful", role, uniqueId, created_at: formattedDate });
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// role based register


// exports.post = async (req, res) => {
//   const { name, email, password, group_name, instructor, role, student_rank, reg_id, address } = req.body;
//   const format = 'DD-MM-YY';

//   try {
    
//     const encryptedPassword = cryptoJS.AES.encrypt(password, secretKey).toString();
//     const uniqueId = uuidv4();
//     const formattedDate = moment().format(format);

//     let query, values;

//     if (role === "admin") {
//       query = `INSERT INTO admin (unique_id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)`;
//       values = [uniqueId, name, email, encryptedPassword, formattedDate];

//       db.query(query, values, (err, result) => {
//         if (err) {
//           console.error("Database Error:", err);
//           return res.status(500).json({ error: err.message });
//         }
//         res.json({ message: "Admin registered", role, uniqueId, created_at: formattedDate, name });
//       });
//     } else if (role === "instructors") {
//       if (!req.body.admin) {
//         return res.status(400).json({ error: "Admin ID is required for instructors" });
//       }

//       query = `INSERT INTO instructors (unique_id, name, email, password, admin, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
//       values = [uniqueId, name, email, encryptedPassword, req.body.admin, formattedDate];

//       db.query(query, values, (err, result) => {
//         if (err) {
//           console.error("Database Error:", err);
//           return res.status(500).json({ error: err.message });
//         }
//         res.json({ message: "Instructor registered", role, uniqueId, created_at: formattedDate });
//       });
//     } else {
//       if (!group_name || !instructor) {
//         return res.status(400).json({ error: "Group Name and Instructor are required for students" });
//       }

//       db.query("SELECT admin FROM instructors WHERE unique_id = ?", [instructor], (err, results) => {
//         if (err) {
//           console.error("Database Error:", err);
//           return res.status(500).json({ error: "Database error" });
//         }

//         if (results.length === 0) {
//           return res.status(400).json({ error: "Instructor not found" });
//         }

//         const fetched_admin_unique_id = results[0].admin;
//         const uniqueId = Math.random().toString(36).substr(2, 6).toLowerCase();

//         const studentQuery = `INSERT INTO students (unique_id, name, email, password, group_name, instructor, admin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
//         const studentValues = [uniqueId, name, email, encryptedPassword, group_name, instructor, fetched_admin_unique_id, formattedDate];

//         db.query(studentQuery, studentValues, (err, result) => {
//           if (err) {
//             console.error("Database Error:", err);
//             return res.status(500).json({ error: err.message });
//           }

//           const studentDetailsQuery = `INSERT INTO students_details (student_unique_id, name, student_rank, reg_id, address) VALUES (?, ?, ?, ?, ?)`;
//           const studentDetailsValues = [uniqueId, name, student_rank || "N/A", reg_id || "N/A", address || "N/A"];

//           db.query(studentDetailsQuery, studentDetailsValues, (err, result) => {
//             if (err) {
//               console.error("Database Error:", err);
//               return res.status(500).json({ error: err.message });
//             }

//             res.json({
//               message: "Student registered",
//               uniqueId,
//               name,
//               group_name,
//               admin: fetched_admin_unique_id,
//               created_at: formattedDate,
//             });
//           });
//         });
//       });
//     }
//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };
