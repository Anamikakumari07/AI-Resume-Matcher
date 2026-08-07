# AI Resume Matcher

## 📌 Description

AI Resume Matcher is a MERN Stack application that allows users to upload resumes, receive ATS scores, get AI-powered job recommendations, save jobs, apply to jobs, and track applications.

---

## Features

- User Authentication (JWT)
- Resume Upload
- Resume History
- ATS Score
- AI Job Matching
- Save Jobs
- Apply Jobs
- Dashboard Analytics
- Profile Management
- Admin Dashboard
- Dark Mode

---

## Tech Stack

### Frontend

- React
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT
- Multer

### AI

- Google Gemini API

---

## Installation

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

### Backend

```
PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

### Frontend

```
VITE_API_URL=
```

---

## Author

Anamika Kumari
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
