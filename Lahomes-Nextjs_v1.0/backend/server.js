const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const createTables = require("./config/tables");
const Register = require("./controllers/Register");
const Login = require("./controllers/Login");
const routes = require("./routes");  

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));

createTables();


// Registration
app.post("/register", Register.post);


// Login
app.post("/login", Login.post);


// Routes
app.use("/", routes);  



app.listen(5000, () => console.log("Server running on port 5000"));
