import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const UploadResume = () => {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [resumeData, setResumeData] = useState(null);

    const [uploadStatus, setUploadStatus] =
        useState("idle");

    const [analysisStatus, setAnalysisStatus] =
        useState("idle");


    // =====================================================
    // FILE SELECT
    // =====================================================

    const handleFileChange = (e) => {

        const selectedFile =
            e.target.files?.[0];


        if (!selectedFile) {
            return;
        }


        setFile(selectedFile);

        setMessage("");

        setResumeData(null);

        setUploadStatus("idle");

        setAnalysisStatus("idle");

    };


    // =====================================================
    // UPLOAD + ANALYZE RESUME
    // =====================================================

    const handleUploadAndAnalyze = async (e) => {

        e.preventDefault();


        // =================================================
        // FILE VALIDATION
        // =================================================

        if (!file) {

            setMessage(
                "Please select a resume first."
            );

            return;

        }


        // =================================================
        // FILE TYPE VALIDATION
        // =================================================

        const allowedTypes = [
            "application/pdf",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setMessage(
                "Please upload a PDF, DOC, or DOCX resume."
            );

            return;

        }


        // =================================================
        // FILE SIZE VALIDATION
        // =================================================

        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            setMessage(
                "Resume file must be smaller than 5 MB."
            );

            return;

        }


        // =================================================
        // TOKEN
        // =================================================

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            setMessage(
                "Please login again."
            );

            return;

        }


        try {

            setLoading(true);

            setMessage(
                "Uploading resume..."
            );

            setResumeData(null);

            setUploadStatus(
                "uploading"
            );

            setAnalysisStatus(
                "idle"
            );


            // =================================================
            // STEP 1 — UPLOAD
            // =================================================

            const formData =
                new FormData();


            formData.append(
                "resume",
                file
            );


            const uploadResponse =
                await axios.post(

                    `${API_URL}/api/resume/upload`,

                    formData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                        },
                    }

                );


            console.log(
                "Upload Response:",
                uploadResponse.data
            );


            setUploadStatus(
                "uploaded"
            );


            setMessage(
                "✅ Resume uploaded. Now analyzing with AI..."
            );


            // =================================================
            // STEP 2 — ANALYZE
            // =================================================

            setAnalysisStatus(
                "analyzing"
            );


            const parseFormData =
                new FormData();


            parseFormData.append(
                "resume",
                file
            );


            const parseResponse =
                await axios.post(

                    `${API_URL}/api/resume/parse`,

                    parseFormData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                        },
                    }

                );


            console.log(
                "Parse Response:",
                parseResponse.data
            );


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (
                !parseResponse.data ||
                !parseResponse.data.success
            ) {

                setAnalysisStatus(
                    "failed"
                );


                setMessage(

                    parseResponse.data?.message ||

                    "Resume uploaded, but AI analysis failed."

                );


                return;

            }


            // =================================================
            // SAVE DATA
            // =================================================

            const extractedData =
                parseResponse.data.data;


            setResumeData(
                extractedData
            );


            setAnalysisStatus(
                "completed"
            );


            setMessage(
                "✅ Resume uploaded and analyzed successfully!"
            );


        } catch (error) {

            console.error(
                "Resume Upload/Analysis Error:",
                error
            );


            console.error(
                "Server Response:",
                error.response?.data
            );


            setAnalysisStatus(
                "failed"
            );


            const serverMessage =
                error.response?.data?.message;


            setMessage(

                serverMessage ||

                "Resume upload or analysis failed."

            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // STATUS HELPERS
    // =====================================================

    const getStatusClass = (
        status
    ) => {

        if (
            status === "completed" ||
            status === "uploaded"
        ) {

            return "border-green-200 bg-green-50";

        }


        if (
            status === "uploading" ||
            status === "analyzing"
        ) {

            return "border-blue-200 bg-blue-50";

        }


        if (
            status === "failed"
        ) {

            return "border-red-200 bg-red-50";

        }


        return "border-gray-200 bg-gray-50";

    };


    // =====================================================
    // RENDER STATUS TEXT
    // =====================================================

    const getStatusText = (
        status
    ) => {

        switch (status) {

            case "uploading":
                return "Uploading...";

            case "uploaded":
                return "Uploaded successfully";

            case "analyzing":
                return "AI is analyzing your resume...";

            case "completed":
                return "AI analysis complete";

            case "failed":
                return "Analysis failed";

            default:
                return "Waiting";

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="container mt-5 pb-5">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="mb-4">

                <h2 className="mb-2">
                    Resume Parser
                </h2>

                <p className="text-muted mb-0">

                    Upload your resume and let AI
                    analyze your skills, education,
                    experience, and projects.

                </p>

            </div>


            {/* =================================================
                UPLOAD CARD
            ================================================= */}

            <div className="card p-4 shadow-sm border-0">

                <h4 className="mb-3">
                    Upload Resume
                </h4>


                {/* =================================================
                    STATUS PANEL
                ================================================= */}

                <div className="row g-3 mb-4">

                    {/* UPLOAD STATUS */}

                    <div className="col-md-6">

                        <div
                            className={`border rounded-3 p-3 ${getStatusClass(
                                uploadStatus
                            )}`}
                        >

                            <div className="d-flex align-items-center gap-3">

                                <div className="fs-4">

                                    {uploadStatus ===
                                        "uploaded" ||
                                    uploadStatus ===
                                        "completed"

                                        ? "✅"

                                        : uploadStatus ===
                                          "uploading"

                                        ? "⏳"

                                        : uploadStatus ===
                                          "failed"

                                        ? "❌"

                                        : "📄"}

                                </div>


                                <div>

                                    <div className="fw-semibold">
                                        Resume Upload
                                    </div>

                                    <small className="text-muted">

                                        {getStatusText(
                                            uploadStatus
                                        )}

                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* AI STATUS */}

                    <div className="col-md-6">

                        <div
                            className={`border rounded-3 p-3 ${getStatusClass(
                                analysisStatus
                            )}`}
                        >

                            <div className="d-flex align-items-center gap-3">

                                <div className="fs-4">

                                    {analysisStatus ===
                                        "completed"

                                        ? "✅"

                                        : analysisStatus ===
                                          "analyzing"

                                        ? "🤖"

                                        : analysisStatus ===
                                          "failed"

                                        ? "❌"

                                        : "🔍"}

                                </div>


                                <div>

                                    <div className="fw-semibold">
                                        AI Analysis
                                    </div>

                                    <small className="text-muted">

                                        {getStatusText(
                                            analysisStatus
                                        )}

                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleUploadAndAnalyze
                    }
                >

                    {/* FILE */}

                    <label className="form-label fw-semibold">

                        Choose Resume

                    </label>


                    <input

                        type="file"

                        className="form-control mb-3"

                        accept=".pdf,.doc,.docx"

                        onChange={
                            handleFileChange
                        }

                        disabled={
                            loading
                        }

                    />


                    {/* FILE INFO */}

                    {file && (

                        <div className="alert alert-secondary">

                            <strong>
                                Selected File:
                            </strong>{" "}

                            {file.name}

                            <br />

                            <small>

                                Size:{" "}

                                {(
                                    file.size /
                                    (1024 * 1024)
                                ).toFixed(2)}

                                {" "}MB

                            </small>

                        </div>

                    )}


                    {/* BUTTON */}

                    <button

                        className="btn btn-primary"

                        disabled={
                            loading ||
                            !file
                        }

                        type="submit"

                    >

                        {loading

                            ? "🤖 Processing Resume..."

                            : "Upload & Analyze Resume"}

                    </button>

                </form>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div
                        className={`alert mt-3 ${
                            analysisStatus ===
                                "failed"

                                ? "alert-danger"

                                : analysisStatus ===
                                  "completed"

                                ? "alert-success"

                                : "alert-info"
                        }`}
                    >

                        {message}

                    </div>

                )}

            </div>


            {/* =====================================================
                ANALYZED RESUME STATUS
            ===================================================== */}

            {resumeData && (

                <div className="card p-4 mt-4 border-0 shadow-sm">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                        <div>

                            <h3 className="mb-1">
                                Resume Analysis Complete
                            </h3>

                            <p className="text-muted mb-0">

                                Your resume has been
                                successfully analyzed.

                            </p>

                        </div>


                        <div className="badge bg-success fs-6 p-2">

                            ✅ Ready for Job Matching

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                AI RESULT
            ===================================================== */}

            {resumeData && (

                <div className="card p-4 mt-4 shadow-sm border-0">

                    <h3 className="mb-4">
                        Extracted Resume Information
                    </h3>


                    {/* =================================================
                        NAME
                    ================================================= */}

                    <h5>
                        Name
                    </h5>

                    <p>
                        {resumeData.name ||
                            "Not available"}
                    </p>


                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <h5>
                        Email
                    </h5>

                    <p>
                        {resumeData.email ||
                            "Not available"}
                    </p>


                    {/* =================================================
                        PHONE
                    ================================================= */}

                    <h5>
                        Phone
                    </h5>

                    <p>
                        {resumeData.phone ||
                            "Not available"}
                    </p>


                    {/* =================================================
                        SKILLS
                    ================================================= */}

                    <h5>
                        Skills
                    </h5>


                    {Array.isArray(
                        resumeData.skills
                    ) &&
                    resumeData.skills.length > 0 ? (

                        <div className="d-flex flex-wrap gap-2 mb-4">

                            {resumeData.skills.map(
                                (
                                    skill,
                                    index
                                ) => (

                                    <span
                                        key={
                                            index
                                        }
                                        className="badge bg-light text-dark border p-2"
                                    >

                                        {skill}

                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <p>
                            No skills found.
                        </p>

                    )}


                    {/* =================================================
                        EDUCATION
                    ================================================= */}

                    <h5>
                        Education
                    </h5>


                    {Array.isArray(
                        resumeData.education
                    ) &&
                    resumeData.education.length > 0 ? (

                        resumeData.education.map(
                            (
                                edu,
                                index
                            ) => (

                                <div
                                    key={
                                        index
                                    }
                                    className="border rounded-3 p-3 mb-3"
                                >

                                    <p className="mb-1">

                                        <strong>

                                            {edu.institution ||
                                                "Institution not available"}

                                        </strong>

                                    </p>


                                    <p className="mb-1">

                                        {edu.degree ||
                                            "Degree not available"}

                                    </p>


                                    <p className="mb-1">

                                        {edu.dates ||
                                            "Dates not available"}

                                    </p>


                                    {edu.cgpa && (

                                        <p className="mb-0">

                                            CGPA:{" "}

                                            {edu.cgpa}

                                        </p>

                                    )}

                                </div>

                            )

                        )

                    ) : (

                        <p>
                            No education found.
                        </p>

                    )}


                    {/* =================================================
                        EXPERIENCE
                    ================================================= */}

                    <h5>
                        Experience
                    </h5>


                    {Array.isArray(
                        resumeData.experience
                    ) &&
                    resumeData.experience.length > 0 ? (

                        resumeData.experience.map(
                            (
                                exp,
                                index
                            ) => (

                                <div
                                    key={
                                        index
                                    }
                                    className="border rounded-3 p-3 mb-3"
                                >

                                    <p className="mb-1">

                                        <strong>

                                            {exp.title ||
                                                "Title not available"}

                                        </strong>

                                    </p>


                                    <p className="mb-1">

                                        {exp.organization ||
                                            "Organization not available"}

                                    </p>


                                    {exp.dates && (

                                        <p className="mb-1">

                                            {exp.dates}

                                        </p>

                                    )}


                                    <p className="mb-0">

                                        {exp.description ||
                                            "No description available"}

                                    </p>

                                </div>

                            )

                        )

                    ) : (

                        <p>
                            No experience found.
                        </p>

                    )}


                    {/* =================================================
                        PROJECTS
                    ================================================= */}

                    <h5>
                        Projects
                    </h5>


                    {Array.isArray(
                        resumeData.projects
                    ) &&
                    resumeData.projects.length > 0 ? (

                        resumeData.projects.map(
                            (
                                project,
                                index
                            ) => (

                                <div
                                    key={
                                        index
                                    }
                                    className="border rounded-3 p-3 mb-3"
                                >

                                    <p className="mb-1">

                                        <strong>

                                            {project.title ||
                                                "Project title not available"}

                                        </strong>

                                    </p>


                                    <p className="mb-1">

                                        {project.description ||
                                            "No description available"}

                                    </p>


                                    {Array.isArray(
                                        project.technologies
                                    ) &&
                                    project.technologies.length > 0 && (

                                        <p className="mb-0">

                                            <strong>
                                                Technologies:
                                            </strong>{" "}

                                            {
                                                project.technologies.join(
                                                    ", "
                                                )
                                            }

                                        </p>

                                    )}

                                </div>

                            )

                        )

                    ) : (

                        <p>
                            No projects found.
                        </p>

                    )}


                    {/* =================================================
                        CERTIFICATIONS
                    ================================================= */}

                    <h5>
                        Certifications
                    </h5>


                    {Array.isArray(
                        resumeData.certifications
                    ) &&
                    resumeData.certifications.length > 0 ? (

                        <ul>

                            {resumeData.certifications.map(
                                (
                                    cert,
                                    index
                                ) => (

                                    <li
                                        key={
                                            index
                                        }
                                    >
                                        {cert}
                                    </li>

                                )
                            )}

                        </ul>

                    ) : (

                        <p>
                            No certifications found.
                        </p>

                    )}


                    {/* =================================================
                        FINAL STATUS
                    ================================================= */}

                    <div className="alert alert-success mt-4 mb-0">

                        <strong>
                            ✅ Resume Analysis Complete
                        </strong>

                        <p className="mb-0 mt-2">

                            Your resume information has
                            been extracted successfully.
                            You can now go to Job Matches
                            and find suitable jobs.

                        </p>

                    </div>

                </div>

            )}

        </div>

    );

};

export default UploadResume;