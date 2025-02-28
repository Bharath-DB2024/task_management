const db = require("../config/db");






exports.fetch = (req, res) => {
  const { admin } = req.body;
console.log(admin);

  if (!admin) {
    return res.status(400).json({ error: "admin_unique_id is required" });
  }

 
  const instructorQuery = `
    SELECT unique_id, name , email , group_name, password ,created_at 
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
        admin,
        instructors: [],
        students: []
      });
    }


    const instructorIds = instructorResults.map(inst => inst.unique_id);

    if (instructorIds.length === 0) {

      
      return res.json({
        message: "Instructors found, but no students exist",
        admin,
        instructors: instructorResults,
        students: []
      });
    }

    
    const studentQuery = `
      SELECT unique_id, name , email , group_name, instructor, created_at ,password
      FROM students 
      WHERE instructor IN (?)`;
   
    db.query(studentQuery, [instructorIds], (err, studentResults) => {
      console.log(instructorIds);
      
      if (err) {
        console.log("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "Instructors and Students fetched successfully",
        admin,
        instructors: instructorResults,
        students: studentResults.length ? studentResults : []
      });
    });
  });
};



exports.fetchInstrcutor = (req, res) => {
  const { admin} = req.body;
  console.log(admin);
  
  if (!admin) {
    return res.status(400).json({ error: "admin is required" });
  }

 
  const instructorQuery = `
    SELECT unique_id, name , email , password ,group_name, created_at 
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
        // admin_unique_id,
        instructors: [],
        // students: []
      });
    }


    const instructorIds = instructorResults.map(inst => inst.instructor_unique_id);

    if (instructorIds.length === 0) {
      return res.json({
        message: "Instructors found, but no students exist",
        // admin_unique_id,
        instructors: instructorResults,
        // students: []
      });
    }

    
    const studentQuery = `
      SELECT unique_id, name , email, group_name, instructor, created_at ,password
      FROM students 
      WHERE instructor IN (?)`;

    db.query(studentQuery, [instructorIds], (err, studentResults) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
      
        instructors: instructorResults,
        // students: studentResults.length ? studentResults : []
      });
    }
  );
  });
};




exports.fetchStudents = (req, res) => {
  const { instructor } = req.body;

  if (!instructor) {
    return res.status(400).json({ error: "instructor_unique_id is required" });
  }

  db.query(
    "SELECT name, group_name, admin FROM instructors WHERE instructor= ?",
    
    [instructor],
    (err, instructorResults) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (instructorResults.length === 0) {
        return res.status(404).json({ error: "Instructor not found" });
      }

      const instructor = instructorResults[0];

      db.query(
        `SELECT unique_id, name, email,password, group_name, created_at 
         FROM students WHERE instructor = ?`,
        [instructor],
        (err, studentResults) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          res.json({
            message: "Students fetched successfully",
            students: studentResults.length ? studentResults : "No students found",
          });
        }
      );
    }
  );
};




