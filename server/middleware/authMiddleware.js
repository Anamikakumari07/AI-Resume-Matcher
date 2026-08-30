const jwt = require("jsonwebtoken");


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware = (req, res, next) => {

    try {

        // =================================================
        // CHECK AUTHORIZATION HEADER
        // =================================================

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required. Please login.",

            });

        }


        // =================================================
        // CHECK BEARER FORMAT
        // =================================================

        if (
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format.",

            });

        }


        // =================================================
        // GET TOKEN
        // =================================================

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token is missing.",

            });

        }


        // =================================================
        // CHECK JWT SECRET
        // =================================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from .env"
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server authentication configuration is missing.",

            });

        }


        // =================================================
        // VERIFY TOKEN
        // =================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =================================================
        // NORMALIZE USER ID
        // =================================================

        const userId =
            decoded.id ||
            decoded._id ||
            decoded.userId;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token.",

            });

        }


        // =================================================
        // ATTACH USER
        // =================================================

        req.user = {

            ...decoded,

            id: userId,

        };


        // =================================================
        // CONTINUE
        // =================================================

        next();


    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Your session has expired. Please login again.",

            });

        }


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token. Please login again.",

            });

        }


        return res.status(401).json({

            success: false,

            message:
                "Authentication failed. Please login again.",

        });

    }

};


module.exports = authMiddleware;