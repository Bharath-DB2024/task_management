const express = require("express");
const router = express.Router();
const Tables = require("./controllers/getTables");
const Fecth=require("./controllers/details");
const DelUp=require("./controllers/delUp");


router.get("/admin", Tables.getAdmins);
router.get("/instructors", Tables.getInstructors);
router.get("/students", Tables.getStudents);

router.post("/fecth",Fecth.fetch);
router.post("/fetchstudents",Fecth.fetchStudents)
router.post("/fetchinstructors",Fecth.fetchInstrcutor)
router.post ("/delete",DelUp.delete);
router.post("/update",DelUp.update);

module.exports = router;
