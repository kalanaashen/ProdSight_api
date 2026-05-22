const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));
app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/activity", require("./routes/activity"));
app.use("/api/appusage", require("./routes/appUsage"));
app.use("/api/webusage", require("./routes/webUsage"));
app.use("/api/prosummary", require("./routes/productivitySummary"));
app.get("/", (req, res) => {
  res.send("Prodsight API running");
});

module.exports = app;
