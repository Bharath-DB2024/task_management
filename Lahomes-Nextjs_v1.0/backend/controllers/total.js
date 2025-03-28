const db = require("../config/db");



exports.getTotal = async (req, res) => {
  const { role, userId } = req.body;

  if (!role || !userId) {
      return res.status(400).json({ message: 'Role and user ID are required' });
  }

  try {
    if (role === 'admin') {
      const totalInstructorsQuery = 'SELECT COUNT(*) AS totalInstructors FROM instructors WHERE admin = ?';
      const totalStudentsQuery = 'SELECT COUNT(*) AS totalStudents FROM students WHERE admin = ?';
      const totalGroupsQuery = 'SELECT COUNT(DISTINCT group_name) AS totalGroups FROM students WHERE admin = ?';
      const completedTasksQuery = `
          SELECT COUNT(*) AS completedTasks 
          FROM task 
          WHERE instructor IN (SELECT instructor FROM instructors WHERE admin = ?) 
          AND status = 1
      `;

      const [instructors] = await db.promise().query(totalInstructorsQuery, [userId]);
      const [students] = await db.promise().query(totalStudentsQuery, [userId]);
      const [groups] = await db.promise().query(totalGroupsQuery, [userId]);
      const [completedTasks] = await db.promise().query(completedTasksQuery, [userId]);

      return res.status(200).json({
          totalInstructors: instructors[0].totalInstructors,
          totalStudents: students[0].totalStudents,
          totalGroups: groups[0].totalGroups,
          completedTasks: completedTasks[0].completedTasks 
      });

      } else if (role === 'instructors') {
          const totalStudentsQuery = 'SELECT COUNT(*) AS totalStudents FROM students WHERE instructor = ?';
          const totalGroupsQuery = 'SELECT COUNT(DISTINCT group_name) AS totalGroups FROM students WHERE instructor = ?';
          const totalTasksQuery = 'SELECT COUNT(*) AS totalTasks FROM task WHERE instructor = ?';
          const completedTasksQuery = 'SELECT COUNT(*) AS completedTasks FROM task WHERE instructor = ? AND status = 1';

          const [students] = await db.promise().query(totalStudentsQuery, [userId]);
          const [groups] = await db.promise().query(totalGroupsQuery, [userId]);
          const [tasks] = await db.promise().query(totalTasksQuery, [userId]);
          const [completedTasks] = await db.promise().query(completedTasksQuery, [userId]);

          return res.status(200).json({
              totalStudents: students[0].totalStudents,
              totalGroups: groups[0].totalGroups,
              totalTasks: tasks[0].totalTasks,
              completedTasks: completedTasks[0].completedTasks
          });

      } else if (role === 'students') {
          const totalTasksQuery = 'SELECT COUNT(*) AS totalTasks FROM task WHERE student = ?';
          const completedTasksQuery = 'SELECT COUNT(*) AS completedTasks FROM task WHERE student = ? AND status = 1';
          const notCompletedTasksQuery = 'SELECT COUNT(*) AS notCompletedTasks FROM task WHERE student = ? AND status = 0';

          const [tasks] = await db.promise().query(totalTasksQuery, [userId]);
          const [completedTasks] = await db.promise().query(completedTasksQuery, [userId]);
          const [notCompletedTasks] = await db.promise().query(notCompletedTasksQuery, [userId]);

          return res.status(200).json({
              totalTasks: tasks[0].totalTasks,
              completedTasks: completedTasks[0].completedTasks,
              notCompletedTasks: notCompletedTasks[0].notCompletedTasks
          });
      }

      res.status(400).json({ message: 'Invalid role' });

  } catch (error) {
      console.error('Error fetching totals:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};





exports.getGroup = async (req, res) => {
  const instructorId = req.params.instructor;

  try {

    const [groups] = await db.promise().query(
      "SELECT DISTINCT group_name FROM students WHERE instructor = ?",
      [instructorId]
    );

    if (!groups || groups.length === 0) {
      console.log("No groups found");
      return res.status(404).json({ error: "No groups found for this instructor" });
    }

    const groupNames = groups.map(group => group.group_name);
   
    res.status(200).json({ groups: groupNames });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


  
  
  