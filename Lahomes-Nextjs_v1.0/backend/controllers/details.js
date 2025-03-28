const db = require("../config/db");
const cryptoJS = require("crypto-js");


const secretKey = "DB PRODUCTIONS"; 





exports.fetchInstrcutor = (req, res) => {
  const { admin } = req.body;

  if (!admin) {
    return res.status(400).json({ error: "admin is required" });
  }

  const instructorQuery = `
    SELECT unique_id, name, email, password, created_at 
    FROM instructors 
    WHERE admin = ?`;

  db.query(instructorQuery, [admin], (err, instructorResults) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (instructorResults.length === 0) {
      return res.json({
        message: "No instructors found for this admin",
        instructors: [],
      });
    }

    instructorResults = instructorResults.map(inst => ({
      ...inst,
      password: decryptData(inst.password),
    }));

    const instructorIds = instructorResults.map(inst => inst.unique_id);

    if (instructorIds.length === 0) {
      return res.json({
        message: "Instructors found, but no students exist",
        instructors: instructorResults,
      });
    }

    const studentQuery = `
      SELECT unique_id, name, email, group_name, instructor, created_at, password, student_rank, reg_id, address
      FROM students 
      WHERE instructor IN (${instructorIds.map(() => '?').join(',')})`;

    db.query(studentQuery, instructorIds, (err, studentResults) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      studentResults = studentResults.map(student => ({
        ...student,
        password: decryptData(student.password),
        reg_id: decryptData(student.reg_id),
        address: decryptData(student.address),
      }));

      res.json({
        instructors: instructorResults,
        students: studentResults.length ? studentResults : [],
      });
    });
  });
};




exports.fetchStudents = (req, res) => {
  const { instructor } = req.body;

  if (!instructor) {
    return res.status(400).json({ error: "instructor_unique_id is required" });
  }

  db.query(
    "SELECT name, admin, unique_id FROM instructors WHERE unique_id = ?",
    [instructor],  
    (err, instructorResults) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (instructorResults.length === 0) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      const instructorData = instructorResults[0];

      const query = `SELECT unique_id, name, email, password, group_name, created_at, student_rank, reg_id, address 
                     FROM students WHERE instructor = ?`;

      db.query(query, [instructorData.unique_id], (err, studentResults) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        studentResults = studentResults.map(student => ({
          ...student,
          password: decryptData(student.password),
          reg_id: decryptData(student.reg_id),
          address: decryptData(student.address),
        }));

        res.json({
          message: "Students fetched successfully",
          students: studentResults.length ? studentResults : [],
        });
      });
    }
  );
};





const decryptData = (encryptedValue) => {
  if (!encryptedValue || !encryptedValue.startsWith("U2FsdGVkX1")) {
    return encryptedValue;
  }
  try {
    const bytes = cryptoJS.AES.decrypt(encryptedValue, secretKey);
    const decryptedValue = bytes.toString(cryptoJS.enc.Utf8);
    return decryptedValue || encryptedValue;
  } catch (error) {
    console.error("Decryption Error:", error);
    return encryptedValue;
  }
};

