const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        company: {
            type: String,
            required: true,
        },

        position: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            default: "Not Specified",
        },

        salary: {
            type: String,
            default: "Not Disclosed",
        },

        jobType: {
            type: String,
            default: "Full Time",
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Interview",
                "Rejected",
                "Selected",
            ],
            default: "Applied",
        },

        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Application",
    applicationSchema
);