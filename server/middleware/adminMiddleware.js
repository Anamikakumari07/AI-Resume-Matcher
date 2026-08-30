const adminMiddleware = (req, res, next) => {

    try {

        // ==========================================
        // CHECK AUTHENTICATED USER
        // ==========================================

        if (!req.user || !req.user.id) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required.",

            });

        }


        // ==========================================
        // CHECK ADMIN ROLE
        // ==========================================

        if (
            String(req.user.role)
                .toLowerCase() !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Access Denied. Admin only.",

            });

        }


        // ==========================================
        // CONTINUE
        // ==========================================

        next();


    } catch (error) {

        console.error(
            "Admin Middleware Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Authorization check failed.",

        });

    }

};


module.exports = adminMiddleware;