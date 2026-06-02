const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const config = require("config");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const error = require("../middleware/error");
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_LOCAL)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));
app.use(cors());
app.use(express.json());
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", [auth], require("./routes/auth"));
app.use("/api/activity", require("./routes/activity"));
app.use("/api/appusage", [auth, admin], require("./routes/appUsage"));
app.use("/api/webusage", [auth, admin], require("./routes/webUsage"));
app.use(
  "/api/prosummary",
  [auth, admin],
  require("./routes/productivitySummary"),
);
app.use("/api/analytics", [auth, admin], require("./routes/analytics"));
app.use(error);

module.exports = app;
