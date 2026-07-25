const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    filename: {
        type: String,
        required: true,
    },

    filePath: {
        type: String,
        required: true,
    },

    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Resume", resumeSchema);