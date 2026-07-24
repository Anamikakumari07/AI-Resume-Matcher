require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});