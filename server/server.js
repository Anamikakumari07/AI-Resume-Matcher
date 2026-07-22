require("dotenv").config();

const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/apiRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});