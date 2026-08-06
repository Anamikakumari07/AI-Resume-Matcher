const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    saveJob,

    getSavedJobs,

    deleteSavedJob,

} = require("../controllers/savedJobController");

router.post(

    "/save",

    authMiddleware,

    saveJob

);

router.get(

    "/",

    authMiddleware,

    getSavedJobs

);

router.delete(

    "/:id",

    authMiddleware,

    deleteSavedJob

);

module.exports = router;