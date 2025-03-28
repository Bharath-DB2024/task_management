const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const createTables = require("./config/tables");
const Register = require("./controllers/Register");
const Login = require("./controllers/Login");
const routes = require("./routes");  
const imageRoutes = require("./routes");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const moment = require("moment");
const cryptoJS = require("crypto-js");
const db = require("./config/db");
const { v4: uuidv4 } = require('uuid');


const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
const PORT=5000;

createTables();

const secretKey = "DB PRODUCTIONS"; 

const format = "DD-MM-YY";

const autoRegisterAdmin = () => {
  const adminEmail = "dbproductions@gmail.com";
  const adminPassword = "dbpro"; 
  const encryptedPassword = cryptoJS.AES.encrypt(adminPassword, secretKey).toString();
  const uniqueId = uuidv4();
  const formattedDate = moment().format(format);

  const query = `INSERT INTO admin (unique_id, name, email, password, created_at) 
                 VALUES (?, ?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE email=email`;

  db.query(query, [uniqueId, "DB Productions", adminEmail, encryptedPassword, formattedDate], (err) => {
    if (err) {
      console.error("Admin Auto-Registration Failed:", err);
    } else {
      console.log("Admin auto-registered successfully.");
    }
  });
};


autoRegisterAdmin();

// Registration
app.post("/register", Register.post);


// Login
app.post("/login", Login.post);


// Routes
app.use("/", routes);  
app.use("/uploads", express.static("uploads"));
app.use("/api", imageRoutes); 



app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `logo_${Date.now()}${path.extname(file.originalname)}`;
    fs.writeFileSync("uploads/logo.json", JSON.stringify({ filename: uniqueFilename })); 
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});



app.get("/get-logo", (req, res) => {
  const logoDataPath = "uploads/logo.json";
  if (fs.existsSync(logoDataPath)) {
    const logoData = JSON.parse(fs.readFileSync(logoDataPath, "utf8"));
    res.json({ imageUrl: `http://localhost:${PORT}/uploads/${logoData.filename}` });
  } else {
    res.json({ imageUrl: null });
  }
});





app.listen(5000, () => console.log("Server running on port 5000"));
