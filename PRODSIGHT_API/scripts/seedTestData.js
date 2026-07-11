const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const { User } = require("../src/models/users");
const { ActivityLog } = require("../src/models/activity");
const { AppUsage } = require("../src/models/appusage");
const { WebUsage } = require("../src/models/webUsage");
const { ProductivitySummary } = require("../src/models/productivitySummary");

const TEST_EMAILS = [
  "admin@prodsight.example.com",
  "john@prodsight.example.com",
  "maya@prodsight.example.com",
  "nimal@prodsight.example.com",
];
const LEGACY_TEST_EMAILS = [
  "admin@prodsight.test",
  "john@prodsight.test",
  "maya@prodsight.test",
  "nimal@prodsight.test",
];

const atUtcHour = (daysAgo, hour, minute = 0) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

async function seed() {
  const mongoUri = process.env.MONGO_LOCAL || process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_LOCAL or MONGO_URI is required");

  await mongoose.connect(mongoUri);

  const cleanupEmails = [...TEST_EMAILS, ...LEGACY_TEST_EMAILS];
  const existingUsers = await User.find({ email: { $in: cleanupEmails } }).select("_id");
  const existingIds = existingUsers.map((user) => user._id);
  await Promise.all([
    ActivityLog.deleteMany({ userId: { $in: existingIds } }),
    AppUsage.deleteMany({ userId: { $in: existingIds } }),
    WebUsage.deleteMany({ userId: { $in: existingIds } }),
    ProductivitySummary.deleteMany({ userId: { $in: existingIds } }),
    User.deleteMany({ email: { $in: cleanupEmails } }),
  ]);

  const password = await bcrypt.hash("Test12345!", 10);
  const users = await User.insertMany([
    { name: "Test Admin", email: TEST_EMAILS[0], password, role: "Project Manager", isAdmin: true },
    { name: "John Doe", email: TEST_EMAILS[1], password, role: "Software Engineer" },
    { name: "Maya Silva", email: TEST_EMAILS[2], password, role: "Designer" },
    { name: "Nimal Perera", email: TEST_EMAILS[3], password, role: "QA Engineer" },
  ]);

  const employees = users.slice(1);
  const activities = [];
  const appUsage = [];
  const webUsage = [];
  const summaries = [];

  employees.forEach((user, userIndex) => {
    const offset = userIndex * 8;
    activities.push(
      { userId: user._id, keystrokes: 780 + offset, mouseClicks: 210 + offset, idleSeconds: 120, activeWindow: "Visual Studio Code", category: "productive", duration: 95, recordedAt: atUtcHour(0, 8 + userIndex) },
      { userId: user._id, keystrokes: 320 + offset, mouseClicks: 145 + offset, idleSeconds: 60, activeWindow: "Slack", category: "productive", duration: 42, recordedAt: atUtcHour(0, 10 + userIndex) },
      { userId: user._id, keystrokes: 45, mouseClicks: 85, idleSeconds: 360, activeWindow: "YouTube", category: "unproductive", duration: 25, recordedAt: atUtcHour(0, 13 + userIndex) },
    );

    appUsage.push(
      { userId: user._id, appName: "Visual Studio Code", windowTitle: "ProdSight project", duration: 180 + offset, category: "productive", recordedAt: atUtcHour(0, 9) },
      { userId: user._id, appName: "Slack", windowTitle: "Team messages", duration: 55, category: "productive", recordedAt: atUtcHour(0, 11) },
      { userId: user._id, appName: "YouTube", windowTitle: "YouTube", duration: 25, category: "unproductive", recordedAt: atUtcHour(0, 14) },
      { userId: user._id, appName: "Calculator", windowTitle: "Calculator", duration: 15, category: "neutral", recordedAt: atUtcHour(0, 15) },
    );

    webUsage.push(
      { userId: user._id, url: "https://github.com/openai", title: "github.com", duration: 75 + offset, category: "productive", recordedAt: atUtcHour(0, 9, 30) },
      { userId: user._id, url: "https://stackoverflow.com", title: "stackoverflow.com", duration: 42, category: "productive", recordedAt: atUtcHour(0, 11, 15) },
      { userId: user._id, url: "https://youtube.com", title: "youtube.com", duration: 28, category: "unproductive", recordedAt: atUtcHour(0, 14, 20) },
      { userId: user._id, url: "https://example.com", title: "example.com", duration: 12, category: "neutral", recordedAt: atUtcHour(0, 16) },
    );

    for (let day = 29; day >= 0; day -= 1) {
      const productiveMinutes = 280 + userIndex * 15 + (day % 5) * 8;
      const unproductiveMinutes = 30 + (day % 3) * 5;
      const neutralMinutes = 35;
      const idleMinutes = 25 + (day % 4) * 3;
      summaries.push({
        userId: user._id,
        productiveMinutes,
        unproductiveMinutes,
        neutralMinutes,
        idleMinutes,
        focusScore: 72 + userIndex * 5 + (day % 4),
        productivityScore: 68 + userIndex * 7 + (day % 5),
        totalWorkMinutes: productiveMinutes + unproductiveMinutes + neutralMinutes + idleMinutes,
        summaryDate: atUtcHour(day, 12),
      });
    }
  });

  await Promise.all([
    ActivityLog.insertMany(activities),
    AppUsage.insertMany(appUsage),
    WebUsage.insertMany(webUsage),
    ProductivitySummary.insertMany(summaries),
  ]);

  console.log(`Seeded ${users.length} users, ${activities.length} activities, ${appUsage.length} app records, ${webUsage.length} web records, and ${summaries.length} summaries.`);
  console.log("Admin login: admin@prodsight.example.com / Test12345!");
  console.log("Search employees: John Doe, Maya Silva, Nimal Perera");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
