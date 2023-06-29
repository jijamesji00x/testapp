const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const port = 3000; // Choose any available port number
const path = require("path");

app.use(cors());
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Serve static files from the frontend directory
router.use(express.static(path.join(__dirname, "../frontend")));

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to the database");
  }
});
// Handle requests for the index.html file
// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend", "index.html"));
// });
// router.get("/", function (req, res, next) {
//   res.sendFile(path.join(__dirname, "../usr/share/nginx/html", "index.html"));
// });
// router.get("/", (req, res) => {
//   const filePath = path.join(__dirname, "../frontend", "index.html");
//   res.sendFile(filePath);
// });
app.get("/api", (req, res) => {
  // Handle the API request and send a response
  const responseData = { message: "API response" };
  res.json(responseData);
});
// Use the pool to execute queries
router.get("/data", (req, res) => {
  const query = "SELECT * FROM country_and_capitals";

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.json(result.rows);
      //res.send(result.rows);
    }
  });
});
app.use("/", router);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
