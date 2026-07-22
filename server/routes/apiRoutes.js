const express = require("express");

const router = express.Router();

const { getHome } = require("../controllers/apiController");

router.get("/", getHome);

module.exports = router;