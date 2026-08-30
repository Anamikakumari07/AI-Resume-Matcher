const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        skills: {
            type: [String],
            default: [],
        },

        requirements: {
            type: String,
            default: "",
        },

        salary: {
            type: String,
            default: "",
        },

        type: {
            type: String,
            default: "",
        },

        applyUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Job",
    jobSchema
);