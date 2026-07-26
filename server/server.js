require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const geminiRoutes = require("./routes/geminiRoutes");
const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/gemini", geminiRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});