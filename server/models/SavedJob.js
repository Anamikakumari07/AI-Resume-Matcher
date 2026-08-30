const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        matchPercentage: {
            type: Number,
            default: 0,
        },

        matchingSkills: {
            type: [String],
            default: [],
        },

        missingSkills: {
            type: [String],
            default: [],
        },

        analysis: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


// Prevent the same job from being saved twice
savedJobSchema.index(
    {
        user: 1,
        job: 1,
    },
    {
        unique: true,
    }
);


module.exports = mongoose.model(
    "SavedJob",
    savedJobSchema
);