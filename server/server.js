require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");

const connectDB = require("./config/db");

const geminiRoutes = require("./routes/geminiRoutes");
const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const jobMatchRoutes = require("./routes/jobMatchRoutes");

const app = express();


// =====================================================
// CONNECT DATABASE
// =====================================================

connectDB();


// =====================================================
// STARTUP DNS DIAGNOSTIC
// =====================================================

console.log("======================================");
console.log("NETWORK DIAGNOSTIC");
console.log("======================================");

dns.lookup(
    "api.cloudinary.com",
    (error, address, family) => {

        if (error) {

            console.error(
                "Cloudinary DNS ERROR:",
                error.message
            );

        } else {

            console.log(
                "Cloudinary DNS OK:",
                {
                    address,
                    family
                }
            );

        }

    }
);


dns.lookup(
    "generativelanguage.googleapis.com",
    (error, address, family) => {

        if (error) {

            console.error(
                "Gemini DNS ERROR:",
                error.message
            );

        } else {

            console.log(
                "Gemini DNS OK:",
                {
                    address,
                    family
                }
            );

        }

    }
);

console.log("======================================");


// =====================================================
// CORS
// =====================================================

const allowedOrigins = [

    "http://localhost:5173",

    "http://localhost:5174",

    "https://ai-resume-matcher-4.onrender.com"

];


app.use(

    cors({

        origin: function (
            origin,
            callback
        ) {

            if (!origin) {

                return callback(
                    null,
                    true
                );

            }


            if (
                allowedOrigins.includes(
                    origin
                )
            ) {

                return callback(
                    null,
                    true
                );

            }


            return callback(
                new Error(
                    "CORS policy: Origin not allowed"
                )
            );

        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]

    })

);


// =====================================================
// BODY PARSING
// =====================================================

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);


// =====================================================
// STATIC FOLDER
// =====================================================

app.use(
    "/uploads",
    express.static("uploads")
);


// =====================================================
// HOME ROUTE
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "🚀 AI Resume Matcher Backend is Running Successfully!"

        });

    }
);


// =====================================================
// API ROUTES
// =====================================================

app.use(
    "/api",
    apiRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/resume",
    resumeRoutes
);

app.use(
    "/api/gemini",
    geminiRoutes
);

app.use(
    "/api/jobs",
    jobRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/saved-jobs",
    savedJobRoutes
);

app.use(
    "/api/job-match",
    jobMatchRoutes
);


// =====================================================
// 404 ROUTE
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route Not Found"

        });

    }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            error.message
        );


        if (
            error.message &&
            error.message.includes(
                "CORS policy"
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Origin not allowed by CORS policy."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }
);


// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT ||
    5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server Started on Port ${PORT}`
        );

    }
);