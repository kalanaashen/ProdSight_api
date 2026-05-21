# 🚀 ProdSight

AI-Powered Employee Productivity & Behavior Analytics Platform

---

# 📌 Overview

ProdSight is a full-stack employee monitoring and productivity analytics system designed to help organizations understand work patterns, productivity trends, application usage, website activity, and employee focus metrics.

The platform consists of:

* 🖥️ Python Desktop Monitoring Agent
* ⚡ Node.js + Express REST API
* 🍃 MongoDB Database
* 📊 Analytics Engine
* 🤖 AI Productivity Insights
* 🌐 React Dashboard (planned)

ProdSight collects employee activity data in real-time and transforms it into actionable productivity insights.

---

# ✨ Features

## 🔐 Authentication & Security

* JWT Authentication
* Protected APIs
* Password Hashing with bcrypt
* Role-ready architecture

---

## 🖱️ Activity Tracking

* Mouse click tracking
* Keyboard activity tracking
* Idle time detection
* Active window monitoring

---

## 💻 Application Usage Tracking

* Tracks active desktop applications
* Measures time spent per app
* Automatically categorizes:

  * Productive
  * Neutral
  * Unproductive

Examples:

* VS Code → Productive
* Slack → Productive
* YouTube → Unproductive

---

## 🌐 Website Usage Tracking

* Browser activity tracking
* Domain monitoring
* Website categorization
* Time spent analysis

---

## 📈 Productivity Analytics

* Productive time calculation
* Unproductive time analysis
* Focus score generation
* Productivity score analytics
* Daily productivity summaries

---

## 🤖 AI Features (Planned)

* Burnout detection
* Smart recommendations
* Productivity prediction
* Behavior pattern analysis
* AI-generated reports

---

# 🏗️ Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Joi
* bcrypt

## Desktop Agent

* Python

## Frontend (Planned)

* React
* Vite
* Tailwind CSS

---

# 🧠 System Architecture

```text
Desktop Agent (Python)
        ↓
REST API (Node.js + Express)
        ↓
Controllers
        ↓
Services
        ↓
MongoDB Database
        ↓
Analytics Engine
        ↓
React Dashboard
```

---

# 📂 Project Structure

```text
src/
│
├── controllers/
├── services/
├── models/
├── routes/
├── middleware/
├── validators/
│
├── app.js
└── server.js
```

---

# 🗃️ Database Collections

## Users

Stores employee authentication data.

## ActivityLogs

Stores keyboard, mouse, and idle activity.

## AppUsage

Stores application usage data.

## WebsiteUsage

Stores website browsing analytics.

## ProductivitySummary

Stores generated productivity analytics.

---

# 🔑 Environment Configuration

Create:

```text
config/default.json
```

Example:

```json
{
  "jwtPrivateKey": "yourSuperSecretKey"
}
```

⚠️ Never commit this file to GitHub.

Add to `.gitignore`:

```text
config/default.json
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

---

## 4️⃣ Start Backend Server

```bash
nodemon server.js
```

Expected:

```text
Connected to MongoDB...
Server running on port 5000
```

---

# 🔥 API Endpoints

## Authentication

### Register User

```http
POST /api/users
```

### Login

```http
POST /api/auth
```

---

## Activity Logs

### Create Activity

```http
POST /api/activity
```

### Get Activities

```http
GET /api/activity
```

---

## App Usage

### Create App Usage

```http
POST /api/appusage
```

### Get App Usage

```http
GET /api/appusage
```

---

## Website Usage

### Create Website Usage

```http
POST /api/websiteusage
```

### Get Website Usage

```http
GET /api/websiteusage
```

---

# 🔐 Authentication

Protected routes require:

```http
x-auth-token: YOUR_JWT_TOKEN
```

---

# 📊 Future Roadmap

* [ ] React Dashboard
* [ ] Real-time Monitoring
* [ ] Screenshot Monitoring
* [ ] AI Productivity Insights
* [ ] Team Analytics
* [ ] Notifications System
* [ ] Weekly Reports
* [ ] Productivity Heatmaps
* [ ] Socket.IO Live Monitoring
* [ ] Docker Deployment

---

# 🚀 Deployment Plan

## Frontend

* Vercel / Netlify

## Backend

* Railway / Render

## Database

* MongoDB Atlas

---

# 👨‍💻 Author

Kalana Ashen

---

# 📜 License

This project is licensed under the MIT License.
