const express = require("express");
const router = express.Router();
const Tables = require("./controllers/getTables");
const Fetch=require("./controllers/details");
const DelUp=require("./controllers/delUp");
const task=require('./controllers/task_creation');
const { getTask } = require('./controllers/task_creation');
const total=require('./controllers/total');
const { upload, uploadImg, getImg } = require("./controllers/image");
const GameData=require('./controllers/gameData');

router.get("/admin", Tables.getAdmins);
router.get("/instructors", Tables.getInstructors);
router.get("/students", Tables.getStudents);


router.post("/fetchstudents",Fetch.fetchStudents)
router.post("/fetchinstructors",Fetch.fetchInstrcutor)
router.post ("/delete",DelUp.delete);
router.post("/update",DelUp.update);
router.post("/updateTask",DelUp.updateTask);
router.post("/addTask",task.addTask);
router.post('/updateTaskStatus',task.updateTaskStatus);

router.get("/getAllTask/:id", task.getAllTask);

router.get('/getTask/:admin', getTask);
router.get('/grpTask/:id',task.getGrpTask)


router.post('/getInsTask', task.getInsTask);

router.post('/getInstGrpTask',task.getInstGrptask);

router.post('/getStudentTask',task.getStudentTask);

router.post('/getTotal',total.getTotal);

router.get('/getGroup/:instructor', total.getGroup);

router.post("/uploadImg", upload.single("image"), uploadImg); 

router.get("/getImg", getImg); 

router.post('/postGameData',GameData.postGameData);


router.get('/getGameData/:regId', GameData.getGameData);


router.get('/getGameData/gameName/:gameName', GameData.getGameData);


router.get('/getGameData/date/:date',GameData.getGameData);


router.get('/getGameData/gameName/date/:gameName/:date', GameData.getGameData);


// router.post('/getStuGrpTask',task.getStudentGrpTask);


module.exports = router;
