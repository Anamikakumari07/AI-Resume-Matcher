# 🤖 AI Resume Matcher

AI Resume Matcher is a full-stack MERN application that uses **Google Gemini AI** to analyze resumes, calculate ATS scores, and recommend relevant jobs based on a user's skills and experience.

The application also provides resume history, job saving, job applications, application tracking, profile management, dashboard analytics, and an admin dashboard.

---

## 🚀 Live Demo

### Frontend
https://ai-resume-matcher-4.onrender.com

### Backend API
https://ai-resume-matcher-3-abun.onrender.com

---

## ✨ Features

### 👤 User Features

- User Registration and Login
- JWT-based Authentication
- Protected Routes
- Profile Management
- Resume Upload
- Resume History
- Resume Analysis
- ATS Score
- AI-Powered Job Matching
- Matching Skills
- Missing Skills
- Job Recommendations
- Save Jobs
- Apply to Jobs
- Application Tracking
- Dashboard Analytics
- Dark Mode

### 🧠 AI Features

- Resume parsing using Google Gemini
- AI-generated resume analysis
- ATS score calculation
- AI-powered job recommendations
- Matching and missing skill analysis
- Keyword-based fallback matching

### 🛠️ Admin Features

- Admin Authentication
- User Management
- Resume Management
- Job Management
- Application Management
- Dashboard Statistics

---

## 🧰 Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

### AI

- Google Gemini API

### Deployment

- Render
- Cloudinary
- MongoDB

---

## 🏗️ Project Architecture

```text
AI-Resume-Matcher/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── screenshots/
│   ├── login.png
│   ├── dashboard.png
│   ├── upload-resume.png
│   ├── resume-analysis.png
│   ├── job-matches.png
│   ├── saved-jobs.png
│   ├── applications.png
│   ├── profile.png
│   └── resume-history.png
│
└── README.md