const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        // =====================================================
        // USER
        // =====================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        // =====================================================
        // FILE INFORMATION
        // =====================================================

        filename: {
            type: String,
            required: true,
            trim: true,
        },

        resumeUrl: {
            type: String,
            required: true,
        },

        cloudinaryPublicId: {
            type: String,
            default: "",
        },


        // =====================================================
        // ATS SCORE
        // =====================================================

        atsScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },


        // =====================================================
        // PARSED RESUME DATA
        // =====================================================

        parsedData: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
    "Resume",
    resumeSchema
);