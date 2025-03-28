const multer = require("multer");
const path = require("path");
const db = require("../config/db"); 



const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
    
  },
});
const upload = multer({ storage });



const uploadImg = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  db.query(
    "UPDATE settings SET logo = ? WHERE id = 1",
    [imageUrl],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Image uploaded successfully", imageUrl });
    }
  );
};



const getImg = (req, res) => {
  db.query("SELECT logo FROM settings WHERE id = 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ logo: result[0]?.logo || "" });
  });
};

module.exports = { upload, uploadImg, getImg }; 

