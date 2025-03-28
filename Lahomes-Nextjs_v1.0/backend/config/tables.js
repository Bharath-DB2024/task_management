const db = require("../config/db");


const createTables = () => {
  const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unique_id VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at VARCHAR(25) NOT NULL
  );`;

  const createInstructorsTable = `
  CREATE TABLE IF NOT EXISTS instructors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      unique_id VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      admin VARCHAR(255) NOT NULL,
      created_at VARCHAR(25) NOT NULL,
      FOREIGN KEY (admin) REFERENCES admin(unique_id) 
  );`;

  const createStudentsTable = `
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    group_name VARCHAR(50) NOT NULL,
    student_rank VARCHAR(50) NOT NULL,
    reg_id VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(512) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    admin VARCHAR(255) NOT NULL,
    FOREIGN KEY (admin) REFERENCES admin(unique_id),
    FOREIGN KEY (instructor) REFERENCES instructors(unique_id),
    created_at VARCHAR(25) NOT NULL
);`;

const createTasktable = `
CREATE TABLE IF NOT EXISTS task (
  task_id VARCHAR(255) PRIMARY KEY,
  admin VARCHAR(255) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  student VARCHAR(255) NOT NULL,
  task_name VARCHAR(255) NOT NULL,
  group_name VARCHAR(50) NOT NULL,
  status TINYINT(1) NOT NULL,
  created_at  VARCHAR(25) NOT NULL,
  expiry_date VARCHAR(10) NOT NULL, 
  FOREIGN KEY (admin) REFERENCES admin(unique_id),
  FOREIGN KEY (instructor) REFERENCES instructors(unique_id),
  FOREIGN KEY (student) REFERENCES students(unique_id)
);`


const createGame_dateTable = `
CREATE TABLE IF NOT EXISTS game_data (
   game_id VARCHAR(255),
    student_unique_id VARCHAR(255),
    reg_id VARCHAR(255),
    game_name VARCHAR(255) NOT NULL,
    date VARCHAR(20) NOT NULL,
    room VARCHAR(50) NOT NULL,
    game_data JSON NOT NULL,
    FOREIGN KEY (student_unique_id) REFERENCES students(unique_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (reg_id) REFERENCES students(reg_id) ON DELETE CASCADE ON UPDATE CASCADE
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

  db.query(createTasktable, (err) => {
    if (err) {
      console.error("Error creating taskCreation table:", err);
      return;
    }
    console.log("Task Creation table created");
  });
  db.query(createGame_dateTable, (err) => {
    if (err) {
      console.error("Error creating GameData table:", err);
      return;
    }
    console.log("GameData table created");
  });
};



module.exports = createTables;
