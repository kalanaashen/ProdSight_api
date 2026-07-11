const baseUrl = process.env.API_URL || "http://localhost:5000/api";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function request(path, token) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const text = await response.text();
  let body = text;
  try { body = JSON.parse(text); } catch { /* keep text errors readable */ }
  if (!response.ok) throw new Error(`${path} returned ${response.status}: ${text}`);
  return body;
}

async function run() {
  const loginResponse = await fetch(`${baseUrl}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@prodsight.example.com", password: "Test12345!" }),
  });
  const token = await loginResponse.text();
  assert(loginResponse.ok && token.split(".").length === 3, "Login did not return a JWT");
  console.log("PASS Login page authentication");

  const users = await request("/users", token);
  assert(Array.isArray(users) && users.length >= 4, "Employee list is empty");
  assert(users.every((user) => !user.password), "Employee API exposed a password");
  console.log("PASS Employees page user list");

  const employee = await request("/users/by-name/John%20Doe", token);
  assert(employee._id && employee.role === "Software Engineer", "Employee lookup is invalid");
  console.log("PASS Header employee search");

  const date = new Date().toISOString().split("T")[0];
  const activity = await request(`/activity/today/John%20Doe/${date}`, token);
  assert(activity.records?.length >= 3 && activity.totalKeyStrokes > 0, "Activity data is empty");
  console.log("PASS Activity tab");

  const apps = await request(`/appusage/${employee._id}`, token);
  const topApps = await request(`/analytics/top-apps/${employee._id}`, token);
  const daily = await request(`/analytics/daily/${employee._id}?date=${date}`, token);
  const monthly = await request(`/analytics/monthly/${employee._id}`, token);
  assert(apps.length >= 4, "App usage is empty");
  assert(topApps.length > 0, "Top-app analytics is empty");
  assert(daily?.productivityScore != null, "Daily analytics is empty");
  assert(monthly.length >= 30, "Monthly analytics is incomplete");
  console.log("PASS App Usage tab and daily/monthly/top-app analytics");

  const websites = await request(`/webusage/${employee._id}`, token);
  const weekly = await request(`/analytics/weekly/${employee._id}`, token);
  assert(websites.length >= 4, "Web usage is empty");
  assert(weekly.length >= 7, "Weekly analytics is incomplete");
  console.log("PASS Web Usage tab and weekly analytics");

  const summaries = await request("/prosummary", token);
  assert(summaries.length >= 90, "Productivity summaries are incomplete");
  console.log("PASS Productivity summary integration");
}

run().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exit(1);
});
