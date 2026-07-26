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

    analysis: {
        type: String,
        default: "",
    },

    atsScore: {
        type: Number,
        default: 0,
    }

});

module.exports = mongoose.model("Resume", resumeSchema);