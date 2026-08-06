const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(

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

        title: {

            type: String,

            required: true,

        },

        location: {

            type: String,

            default: "Remote",

        },

        matchPercentage: {

            type: Number,

            default: 0,

        },

        reason: {

            type: String,

            default: "",

        },

    },

    {

        timestamps: true,

    }

);

module.exports = mongoose.model(
    "SavedJob",
    savedJobSchema
);