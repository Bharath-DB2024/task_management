const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.post = (req, res) => {
  const { email, password } = req.body;

  const roles = ["admin", "instructors", "students"];
  let foundUser = null;
  let userRole = null;

  const checkNextRole = (index) => {
    if (index >= roles.length) {
      return res.status(401).json({ error: "User not found" });
    }

    const role = roles[index];

    db.query(`SELECT * FROM ${role} WHERE email = ?`, [email], async (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        foundUser = results[0];
        userRole = role;
        return processLogin();
      } else {
        checkNextRole(index + 1);
      }
    });
  };

  const processLogin = async () => {
    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log(isMatch)
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  
    const tokenPayload = {
      id: foundUser.id,
      email: foundUser.email,
      role: userRole,
    };
  
    let uniqueIdKey = null;
    let uniqueIdValue = null;
  
    if (userRole === "admin") {
      uniqueIdKey = "unique_id";
      uniqueIdValue = foundUser.unique_id;
    } else if (userRole === "instructors") {
      uniqueIdKey = "instructor_unique_id";
      uniqueIdValue = foundUser.unique_id;
    } else if (userRole === "students") {
      uniqueIdKey = "student_unique_id";
      uniqueIdValue = foundUser.unique_id;
    }
  
    const token = jwt.sign(tokenPayload, "dbproductions", { expiresIn: "1m" });
        
    return res.json({ 
      message: "Login successful", 
      token, 
      role: userRole, 
      [uniqueIdKey]: uniqueIdValue
    });
  };
  

  checkNextRole(0);
};
