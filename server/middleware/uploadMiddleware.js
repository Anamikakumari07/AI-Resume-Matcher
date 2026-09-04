const multer = require("multer");


// =====================================================
// MEMORY STORAGE
// =====================================================
//
// The uploaded PDF is kept temporarily in memory.
// It is NOT permanently stored on the Render filesystem.
//
// The controller will upload the file to Cloudinary.
//

const storage =
    multer.memoryStorage();


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    if (
        file.mimetype ===
        "application/pdf"
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only PDF files are allowed."
            )
        );

    }

};


// =====================================================
// MULTER
// =====================================================

const upload =
    multer({

        storage,

        fileFilter,

        limits: {

            // 5 MB maximum resume size

            fileSize:
                5 * 1024 * 1024,

        },

    });


module.exports = upload;