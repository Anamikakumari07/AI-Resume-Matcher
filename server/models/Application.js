const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
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


// Prevent duplicate applications for the same job
applicationSchema.index(
    {
        user: 1,
        jobId: 1,
    },
    {
        unique: true,
    }
);


module.exports = mongoose.model(
    "Application",
    applicationSchema
);