const db = require("../config/db");

const createTables = () => {
  const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unique_id VARCHAR(6) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at VARCHAR(100) NOT NULL
  );`;

  const createInstructorsTable = `
  CREATE TABLE IF NOT EXISTS instructors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unique_id VARCHAR(6) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      group_name VARCHAR(50) NOT NULL,
      admin VARCHAR(6) NOT NULL,
      FOREIGN KEY (admin) REFERENCES admin(unique_id),
      created_at VARCHAR(100) NOT NULL
  );`;

  const createStudentsTable = `
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(6) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    group_name VARCHAR(50) NOT NULL,
    instructor VARCHAR(6) NOT NULL,
    admin VARCHAR(6) NOT NULL,
    FOREIGN KEY (admin) REFERENCES admin(unique_id),
    FOREIGN KEY (instructor) REFERENCES instructors(unique_id),
    created_at VARCHAR(100) NOT NULL
);`;


  db.query(createAdminTable, (err) => {
    if (err) {
      console.error("Error creating admin table:", err);
      return;
    }
    console.log("Admin table created");
  });

  db.query(createInstructorsTable, (err) => {
    if (err) {
      console.error("Error creating instructors table:", err);
      return;
    }
    console.log("Instructors table created");
  });

  db.query(createStudentsTable, (err) => {
    if (err) {
      console.error("Error creating students table:", err);
      return;
    }
    console.log("Students table created");
  });
};

module.exports = createTables;
