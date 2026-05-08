const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1:27017/prodsight")
  .then(()=>{console.log("Connected to MongoDB...")})
  .catch((err) => console.error("Could not connect to MongoDB...", err));
app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/activity",require("./routes/activity"));

app.get("/", (req, res) => {
  res.send("Prodsight API running");
});

module.exports = app;
