const db = require("../config/db");  


exports.post = async (req, res) => {
  const { name, email, number, propertiesNumber, description, zipCode, city, country } = req.body;

  if (!name || !email || !number || !propertiesNumber || !description || !zipCode || !city || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO agents (name, email, number, propertiesNumber, description, zipCode, city, country) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, number, propertiesNumber, description, zipCode, city, country], (err, result) => {
    if (err) {
      console.error(" Error inserting agent:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "✅ Agent added successfully", agentId: result.insertId });
  });
};
