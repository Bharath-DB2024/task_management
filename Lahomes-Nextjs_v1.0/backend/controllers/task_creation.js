const db = require("../config/db");
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');




exports.addTask = async (req, res) => {
  const { instructor, task_name, group_name, expiry_date } = req.body;

  if (!instructor || !task_name || !group_name || !expiry_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const formattedDate = moment().format("DD-MM-YYYY");
  const formattedExpiryDate = moment(expiry_date, "DD-MM-YYYY").format("DD-MM-YYYY");

  try {
    
    const [adminResult] = await db.promise().query(
      "SELECT admin FROM instructors WHERE unique_id = ?",
      [instructor]
    );

    if (adminResult.length === 0) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    const admin_id = adminResult[0].admin;

    const [existingTask] = await db.promise().query(
      "SELECT task_id FROM task WHERE task_name = ? AND group_name = ? AND instructor = ?",
      [task_name, group_name, instructor]
    );

    if (existingTask.length > 0) {
      return res.status(409).json({ 
        error: `This task already exists for this group` 
      });
    }

    let query = "SELECT unique_id, group_name FROM students WHERE instructor = ?";
    let queryParams = [instructor];

    if (group_name.toLowerCase() !== "all") {
      query += " AND group_name = ?";
      queryParams.push(group_name);
    }

    const [students] = await db.promise().query(query, queryParams);

    if (students.length === 0) {
      return res.status(404).json({ 
        error: group_name.toLowerCase() !== "all" 
          ? "Group not found" 
          : "No students found" 
      });
    }

    const taskQueries = students.map((student) => {
      const taskId = uuidv4();
      return db.promise().query(
        "INSERT INTO task (task_id, admin, instructor, student, task_name, group_name, status, created_at, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          taskId, 
          admin_id, 
          instructor, 
          student.unique_id, 
          task_name, 
          student.group_name, 
          0, 
          formattedDate, 
          formattedExpiryDate
        ]
      );
    });

    await Promise.all(taskQueries);

    res.status(201).json({ 
      message: `Task Assigned successfully` 
    });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.updateTaskStatus = async (req, res) => {
  const { student_id, task_name } = req.body;

  if (!student_id || !task_name) {
    return res.status(400).json({ error: "Student ID and Task Name are required" });
  }

  try {
   
    const [taskExists] = await db.promise().query(
      "SELECT * FROM task WHERE task_name = ? AND student = ?",
      [task_name, student_id]
    );

    if (taskExists.length === 0) {
      return res.status(404).json({ error: "Task not found for the given student" });
    }

    if (taskExists[0].status === 1) {
      return res.status(409).json({ error: "This task is already completed." });
    }

    await db.promise().query(
      "UPDATE task SET status = 1 WHERE task_name = ? AND student = ?",
      [task_name, student_id]
    );

    const { group_name, instructor } = taskExists[0];

    const [remainingTasks] = await db.promise().query(
      "SELECT task_id FROM task WHERE task_name = ? AND group_name = ? AND instructor = ? AND status = 0",
      [task_name, group_name, instructor]
    );
    if (remainingTasks.length === 0) {
      await db.promise().query(
        "UPDATE task SET status = 1 WHERE task_name = ? AND group_name = ? AND instructor = ?",
        [task_name, group_name, instructor]
      );
    }

    res.status(200).json({ message: "Task status updated successfully in task table" });

  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





exports.getAllTask = async (req, res) => {
  const unique_id = req.params.id;

  if (!unique_id) {
    return res.status(400).json({ error: "Unique ID is required" });
  }

  try {
    const [tasks] = await db.promise().query(
      "SELECT task_id, task_name, status, group_name, created_at, expiry_date FROM task WHERE instructor = ? OR student = ?",
      [unique_id, unique_id]
    );

    if (tasks.length === 0) {
      return res.status(200).json({ message: "Task fetched successfully", task: "No tasks found" });
    }

    const formattedTasks = tasks.map((task) => ({
      task_id: task.task_id,
      task_name: task.task_name,
      status: task.status === 0 ? "Not Completed" : "Completed",
      groupName: task.group_name,
      created_at: task.created_at,
      expiry_date: task.expiry_date,
      is_completed: task.status === 1
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Bar Chart

exports.getTask = async (req, res) => {
  try {
    const admin = req.params.admin;

    const query = `
      SELECT 
        i.unique_id AS instructor_id,
        i.name AS instructor_name,
        COUNT(t.task_id) AS total_tasks,
        SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
        SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
      FROM instructors i
      LEFT JOIN task t ON i.unique_id = t.instructor
      WHERE i.admin = ?
      GROUP BY i.unique_id, i.name
    `;

    const [rows] = await db.promise().execute(query, [admin]);

    if (!Array.isArray(rows)) {
      console.error('Unexpected database response:', rows);
      return res.status(500).json({ error: 'Unexpected database response' });
    }

    const formattedData = rows.map(row => ({
      instructor: {
        name: row.instructor_name,
        total_tasks: row.total_tasks,
        completed_tasks: row.completed_tasks
      }
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching task data:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};



exports.getGrpTask = async (req, res) => {
  try {
    const id = req.params.id;

    const checkAdminQuery = `SELECT * FROM admin WHERE unique_id = ?`;
    const checkInstructorQuery = `SELECT * FROM instructors WHERE unique_id = ?`;
    const checkStudentQuery = `SELECT * FROM students WHERE unique_id = ?`;

    db.query(checkAdminQuery, [id], (err, adminResult) => {
      if (err) {
        console.error('Error checking admin:', err);
        return res.status(500).json({ message: 'Error checking admin' });
      }

      if (adminResult.length > 0) {
        const adminQuery = `
          SELECT 
            t.group_name,
            COUNT(*) AS total_tasks,
            SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
            SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
          FROM task t
          JOIN instructors i ON t.instructor = i.unique_id
          WHERE i.admin = ?
          GROUP BY t.group_name;
        `;

        return db.query(adminQuery, [id], (err, result) => {
          if (err) {
            console.error('Error fetching admin group task stats:', err);
            return res.status(500).json({ message: 'Error fetching admin group task stats' });
          }
          const response = {
            role: 'admin',
            admin: id,
            groups: result.map(group => ({
              group_name: group.group_name,
              total_tasks: Number(group.total_tasks),
              completed_tasks: Number(group.completed_tasks),
              not_completed_tasks: Number(group.not_completed_tasks)
            }))
          };
          res.status(200).json(response);
        });
      }

      db.query(checkInstructorQuery, [id], (err, instructorResult) => {
        if (err) {
          console.error('Error checking instructor:', err);
          return res.status(500).json({ message: 'Error checking instructor' });
        }

        if (instructorResult.length > 0) {
          const instructorQuery = `
            SELECT 
              s.group_name,
              COUNT(t.task_id) AS total_tasks,
              SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
              SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
            FROM students s
            LEFT JOIN task t ON s.unique_id = t.student
            WHERE s.instructor = ?
            GROUP BY s.group_name;
          `;

          return db.query(instructorQuery, [id], (err, result) => {
            if (err) {
              console.error('Error fetching instructor group task stats:', err);
              return res.status(500).json({ message: 'Error fetching instructor group task stats' });
            }
            const response = {
              role: 'instructor',
              instructor: id,
              groups: result.map(group => ({
                group_name: group.group_name,
                total_tasks: Number(group.total_tasks),
                completed_tasks: Number(group.completed_tasks),
                not_completed_tasks: Number(group.not_completed_tasks)
              }))
            };
            res.status(200).json(response);
          });
        }

        db.query(checkStudentQuery, [id], (err, studentResult) => {
          if (err) {
            console.error('Error checking student:', err);
            return res.status(500).json({ message: 'Error checking student' });
          }

          if (studentResult.length > 0) {
            const studentQuery = `
              SELECT 
                COUNT(task_id) AS total_tasks,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
                SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
              FROM task
              WHERE student = ?;
            `;

            return db.query(studentQuery, [id], (err, result) => {
              if (err) {
                console.error('Error fetching student task stats:', err);
                return res.status(500).json({ message: 'Error fetching student task stats' });
              }

              const response = {
                role: 'student',
                student: id,
                tasks: {
                  total_tasks: Number(result[0].total_tasks),
                  completed_tasks: Number(result[0].completed_tasks),
                  not_completed_tasks: Number(result[0].not_completed_tasks)
                }
              };
              res.status(200).json(response);
            });
          }
          res.status(404).json({ message: 'User not found' });
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Donut chart


exports.getInsTask = async (req, res) => {
  try {
   
    const { instructorId } = req.body;

    if (!instructorId) {
      return res.status(400).json({ error: 'Instructor ID is required' });
    }


    const query = `
      SELECT i.unique_id AS instructor_id, i.name AS instructor_name, 
             COUNT(t.task_id) AS total_tasks, 
             SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks, 
             SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
      FROM instructors i 
      LEFT JOIN task t ON i.unique_id = t.instructor 
      WHERE i.unique_id = ? 
      GROUP BY i.unique_id, i.name
    `;

    const [rows] = await db.promise().execute(query, [instructorId]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'Instructor not found or no tasks available' });
    }

    const instructorData = rows[0] || {};

    const formattedData = {
        instructor_id: instructorData.instructor_id,
        instructor_name: instructorData.instructor_name,
        total_task: instructorData.total_tasks,
        completed_task: Number(instructorData.completed_tasks), 
        not_completed_task: Number(instructorData.not_completed_tasks) 
    };

    res.status(200).json(formattedData);

  } catch (error) {
   
    console.error('Error fetching task data:', error);

    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};



exports.getInstGrptask = (req, res) => {
  const { instructorId } = req.body;
  if (!instructorId) {
      return res.status(400).json({ error: 'Instructor ID is required' });
  }

  const query = `
      SELECT 
          i.admin,
          i.group_name,
          i.unique_id AS instructor,
          i.name AS instructor_name,
          COUNT(t.task_id) AS total_tasks,
          SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
          SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
      FROM instructors i
      LEFT JOIN task t 
          ON t.instructor = i.unique_id 
          AND t.student IN (SELECT unique_id FROM students WHERE group_name = 'Green')
      WHERE 
          i.admin = (SELECT admin FROM instructors WHERE unique_id = ?) 
          AND i.group_name = 'Green'
      GROUP BY 
          i.admin, 
          i.group_name, 
          i.unique_id, 
          i.name
  `;

  db.query(query, [instructorId], (err, results) => {
      if (err) {
          console.error('Error fetching task summary:', err);
          return res.status(500).json({ error: 'Failed to fetch task summary' });
      }

      let totalTasks = 0;
      const taskSummary = results.map(task => {
          totalTasks += task.total_tasks;
          return {
              instructorId: task.instructor,
              instructorName: task.instructor_name,
              totalTasks: task.total_tasks,
              completedTasks: Number(task.completed_tasks),
              notCompletedTasks: Number(task.not_completed_tasks),
          };
      });

      res.json({
          adminId: results[0]?.admin || null,
          groupName: results[0]?.group_name || null,
          taskSummary,
          totalTask: totalTasks
      });
  });
};



exports.getStudentTask= async (req, res) => {

   try {

    const { studentId } = req.body;

    if (!studentId) {
      console.error('Student ID is missing');
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const query = `
  SELECT 
    s.unique_id AS student_id,
    s.name AS student_name,
    s.group_name AS student_group,
    COUNT(t.task_id) AS total_tasks,
    SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
  FROM students s
  LEFT JOIN task t ON s.unique_id = t.student
  WHERE s.unique_id = ?
  GROUP BY s.unique_id, s.name, s.group_name
`;


    const [rows] = await db.promise().execute(query, [studentId]);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn(`No tasks found for student: ${studentId}`);
      return res.status(404).json({ error: 'Student not found or no tasks available' });
    }

    const studentData = rows[0];

    const formattedData = {
      student_id: studentData.student_id,
      student_name: studentData.student_name,
      student_group: studentData.student_group,
      total_task: studentData.total_tasks,
      completed_task: Number(studentData.completed_tasks),
      not_completed_task: Number(studentData.not_completed_tasks)
    };

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching task data:', error.message);
    console.error('Stack trace:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


exports.getStudentGrpTask = (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
    SELECT 
      s.admin,
      t.student,
      s.name AS student_name,
      i.name AS instructor_name,
      s.group_name,
      COUNT(*) AS total_tasks,
      SUM(CASE WHEN t.status = 1 THEN 1 ELSE 0 END) AS completed_tasks,
      SUM(CASE WHEN t.status = 0 THEN 1 ELSE 0 END) AS not_completed_tasks
    FROM task t
    JOIN students s ON t.student = s.unique_id
    JOIN instructors i ON s.instructor = i.unique_id
    WHERE s.admin = (SELECT admin FROM students WHERE unique_id = ?)
      AND s.group_name = (SELECT group_name FROM students WHERE unique_id = ?)
    GROUP BY s.admin, s.group_name, t.student, s.name, i.name
  `;

  db.query(query, [studentId, studentId], (err, results) => {
    if (err) {
      console.error('Error fetching student task summary:', err);
      return res.status(500).json({ error: 'Failed to fetch student task summary' });
    }

    const taskSummary = results.map(task => ({
      adminId: task.admin,
      studentId: task.student,
      studentName: task.student_name,
      instructorName: task.instructor_name,
      groupName: task.group_name,
      totalTasks: task.total_tasks,
      completedTasks: Number(task.completed_tasks),
      notCompletedTasks: Number(task.not_completed_tasks),
    }));

    res.json({ adminId: taskSummary[0]?.adminId || null, taskSummary });
  });
};
