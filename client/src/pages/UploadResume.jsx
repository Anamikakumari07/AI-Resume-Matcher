import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";


const UploadResume = () => {

    const [file, setFile] =
        useState(null);


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState("");


    const [resumeData, setResumeData] =
        useState(null);


    const [atsScore, setAtsScore] =
        useState(null);


    const [uploadStatus, setUploadStatus] =
        useState("idle");


    const [analysisStatus, setAnalysisStatus] =
        useState("idle");


    // =====================================================
    // FILE SELECT
    // =====================================================

    const handleFileChange =
        (e) => {

            const selectedFile =
                e.target.files?.[0];


            if (!selectedFile) {

                setFile(null);

                return;

            }


            setFile(
                selectedFile
            );

            setMessage("");

            setResumeData(null);

            setAtsScore(null);

            setUploadStatus(
                "idle"
            );

            setAnalysisStatus(
                "idle"
            );

        };


    // =====================================================
    // UPLOAD + ANALYZE
    // =====================================================

    const handleUploadAndAnalyze =
        async (e) => {

            e.preventDefault();


            // =================================================
            // FILE CHECK
            // =================================================

            if (!file) {

                setMessage(
                    "Please select a resume first."
                );

                return;

            }


            // =================================================
            // PDF CHECK
            // =================================================

            if (
                file.type !==
                "application/pdf"
            ) {

                setMessage(
                    "Please upload a PDF resume."
                );

                setUploadStatus(
                    "failed"
                );

                return;

            }


            // =================================================
            // FILE SIZE
            // =================================================

            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size >
                maxSize
            ) {

                setMessage(
                    "Resume file must be 5 MB or smaller."
                );

                setUploadStatus(
                    "failed"
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
                    "Your session has expired. Please login again."
                );

                toast.error(
                    "Please login again."
                );

                return;

            }


            try {

                setLoading(true);

                setMessage("");

                setResumeData(
                    null
                );

                setAtsScore(
                    null
                );

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
                    await API.post(

                        "/resume/upload",

                        formData,

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                if (
                    !uploadResponse.data?.success
                ) {

                    throw new Error(

                        uploadResponse.data?.message ||

                        "Resume upload failed."

                    );

                }


                setUploadStatus(
                    "uploaded"
                );


                setMessage(
                    "Resume uploaded successfully. Starting AI analysis..."
                );


                // =================================================
                // GET EXACT RESUME ID
                // =================================================

                const resumeId =
                    uploadResponse
                        .data
                        ?.resume
                        ?._id;


                if (
                    !resumeId
                ) {

                    setUploadStatus(
                        "failed"
                    );

                    setAnalysisStatus(
                        "failed"
                    );


                    throw new Error(
                        "Resume was uploaded, but no resume ID was returned."
                    );

                }


                // =================================================
                // STEP 2 — ANALYZE
                // =================================================

                setAnalysisStatus(
                    "analyzing"
                );


                setMessage(
                    "🤖 AI is analyzing your resume. This may take a little while..."
                );


                const parseFormData =
                    new FormData();


                parseFormData.append(
                    "resume",
                    file
                );


                parseFormData.append(
                    "resumeId",
                    resumeId
                );


                const parseResponse =
                    await API.post(

                        "/resume/parse",

                        parseFormData,

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                if (
                    !parseResponse.data?.success
                ) {

                    throw new Error(

                        parseResponse
                            .data
                            ?.message ||

                        "Resume analysis failed."

                    );

                }


                // =================================================
                // SAVE ANALYSIS
                // =================================================

                const extractedData =
                    parseResponse
                        .data
                        ?.data ||
                    null;


                const returnedATS =
                    Number(
                        parseResponse
                            .data
                            ?.atsScore
                    );


                setResumeData(
                    extractedData
                );


                setAtsScore(

                    Number.isFinite(
                        returnedATS
                    )

                        ? returnedATS

                        : 0

                );


                setAnalysisStatus(
                    "completed"
                );


                setMessage(
                    "✅ Resume uploaded and analyzed successfully!"
                );


                toast.success(
                    "Resume analysis completed successfully."
                );


            } catch (error) {

                const status =
                    error.response?.status;


                const serverMessage =
                    error.response
                        ?.data
                        ?.message;


                let userMessage =
                    serverMessage ||
                    error.message ||
                    "Resume upload or analysis failed.";


                // =================================================
                // FRIENDLY ERROR MESSAGES
                // =================================================

                if (
                    status === 401
                ) {

                    userMessage =
                        "Your session has expired. Please login again.";

                }


                if (
                    status === 413
                ) {

                    userMessage =
                        "Resume file is too large. Please upload a PDF smaller than 5 MB.";

                }


                if (
                    status === 429
                ) {

                    userMessage =
                        "AI service quota has been reached. Please try again later.";

                }


                if (
                    status === 503
                ) {

                    userMessage =
                        "AI service is temporarily unavailable. Please try again in a moment.";

                }


                setUploadStatus(

                    previous =>

                        previous ===
                        "uploaded"

                            ? previous

                            : "failed"

                );


                setAnalysisStatus(
                    "failed"
                );


                setMessage(
                    userMessage
                );


                toast.error(
                    userMessage
                );

            } finally {

                setLoading(
                    false
                );

            }

        };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass =
        (status) => {

            if (
                status ===
                    "completed" ||
                status ===
                    "uploaded"
            ) {

                return "border-green-200 bg-green-50";

            }


            if (
                status ===
                    "uploading" ||
                status ===
                    "analyzing"
            ) {

                return "border-blue-200 bg-blue-50";

            }


            if (
                status ===
                "failed"
            ) {

                return "border-red-200 bg-red-50";

            }


            return "border-gray-200 bg-gray-50";

        };


    // =====================================================
    // STATUS TEXT
    // =====================================================

    const getStatusText =
        (status) => {

            switch (
                status
            ) {

                case "uploading":

                    return "Uploading resume...";


                case "uploaded":

                    return "Uploaded successfully";


                case "analyzing":

                    return "AI is analyzing your resume...";


                case "completed":

                    return "AI analysis complete";


                case "failed":

                    return "Analysis failed";


                default:

                    return "Waiting for resume";

            }

        };


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon =
        (status) => {

            if (
                status ===
                "completed"
            ) {

                return "✅";

            }


            if (
                status ===
                    "uploading" ||
                status ===
                    "analyzing"
            ) {

                return "⏳";

            }


            if (
                status ===
                "failed"
            ) {

                return "❌";

            }


            if (
                status ===
                "uploaded"
            ) {

                return "✅";

            }


            return "📄";

        };


    return (

        <Layout>

            <div className="max-w-5xl mx-auto pb-10">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="mb-8">

                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        Resume Intelligence
                    </p>


                    <h1 className="text-4xl font-bold text-gray-800 mt-1">
                        Resume Parser
                    </h1>


                    <p className="text-gray-500 mt-2">
                        Upload your PDF resume and let AI analyze your skills,
                        education, experience, projects, and certifications.
                    </p>

                </div>


                {/* =================================================
                    UPLOAD CARD
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Upload Resume
                    </h2>


                    {/* =================================================
                        PROGRESS
                    ================================================= */}

                    <div className="grid md:grid-cols-2 gap-4 mb-6">


                        {/* UPLOAD */}

                        <div
                            className={`border rounded-xl p-4 ${getStatusClass(
                                uploadStatus
                            )}`}
                        >

                            <div className="flex items-center gap-3">

                                <div className="text-2xl">
                                    {getStatusIcon(
                                        uploadStatus
                                    )}
                                </div>


                                <div>

                                    <p className="font-semibold text-gray-800">
                                        Step 1 — Resume Upload
                                    </p>


                                    <p className="text-sm text-gray-500 mt-1">
                                        {getStatusText(
                                            uploadStatus
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ANALYSIS */}

                        <div
                            className={`border rounded-xl p-4 ${getStatusClass(
                                analysisStatus
                            )}`}
                        >

                            <div className="flex items-center gap-3">

                                <div className="text-2xl">
                                    {getStatusIcon(
                                        analysisStatus
                                    )}
                                </div>


                                <div>

                                    <p className="font-semibold text-gray-800">
                                        Step 2 — AI Analysis
                                    </p>


                                    <p className="text-sm text-gray-500 mt-1">
                                        {getStatusText(
                                            analysisStatus
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PROGRESS BAR
                    ================================================= */}

                    <div className="mb-6">

                        <div className="flex justify-between text-xs text-gray-500 mb-2">

                            <span>
                                Overall Progress
                            </span>


                            <span>

                                {analysisStatus ===
                                "completed"

                                    ? "100%"

                                    : analysisStatus ===
                                      "analyzing"

                                    ? "75%"

                                    : uploadStatus ===
                                      "uploaded"

                                    ? "50%"

                                    : uploadStatus ===
                                      "uploading"

                                    ? "25%"

                                    : "0%"

                                }

                            </span>

                        </div>


                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                            <div

                                className={`h-full rounded-full transition-all duration-500 ${
                                    analysisStatus ===
                                    "completed"

                                        ? "bg-green-500 w-full"

                                        : analysisStatus ===
                                          "analyzing"

                                        ? "bg-blue-500 w-3/4"

                                        : uploadStatus ===
                                          "uploaded"

                                        ? "bg-blue-500 w-1/2"

                                        : uploadStatus ===
                                          "uploading"

                                        ? "bg-blue-500 w-1/4"

                                        : uploadStatus ===
                                          "failed" ||
                                          analysisStatus ===
                                          "failed"

                                        ? "bg-red-500 w-1/4"

                                        : "w-0"
                                }`}

                            />

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

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Choose Resume PDF
                        </label>


                        <input

                            type="file"

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"

                            accept=".pdf,application/pdf"

                            onChange={
                                handleFileChange
                            }

                            disabled={
                                loading
                            }

                        />


                        {/* FILE INFO */}

                        {file && (

                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">

                                <div className="flex items-start gap-3">

                                    <div className="text-2xl">
                                        📄
                                    </div>


                                    <div className="min-w-0">

                                        <p className="font-semibold text-gray-800 break-all">
                                            {file.name}
                                        </p>


                                        <p className="text-sm text-gray-500 mt-1">

                                            Size:{" "}

                                            {(
                                                file.size /
                                                (
                                                    1024 *
                                                    1024
                                                )
                                            ).toFixed(2)}

                                            {" "}MB

                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            BUTTON
                        ================================================= */}

                        <button

                            type="submit"

                            disabled={
                                loading ||
                                !file
                            }

                            className={`mt-5 w-full md:w-auto px-6 py-3 rounded-xl font-semibold transition ${
                                loading ||
                                !file

                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"

                                    : "bg-blue-600 text-white hover:bg-blue-700"

                            }`}
                        >

                            {loading

                                ? "⏳ Processing Resume..."

                                : "🚀 Upload & Analyze Resume"

                            }

                        </button>

                    </form>


                    {/* =================================================
                        MESSAGE
                    ================================================= */}

                    {message && (

                        <div
                            className={`mt-5 rounded-xl border p-4 ${
                                analysisStatus ===
                                "failed"

                                    ? "bg-red-50 border-red-200 text-red-700"

                                    : analysisStatus ===
                                      "completed"

                                    ? "bg-green-50 border-green-200 text-green-700"

                                    : "bg-blue-50 border-blue-200 text-blue-700"
                            }`}
                        >

                            <p className="font-medium">
                                {message}
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    ANALYSIS SUMMARY
                ================================================= */}

                {resumeData && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                                    Analysis Complete
                                </p>


                                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                                    Your Resume Is Ready
                                </h2>


                                <p className="text-gray-500 mt-2">
                                    Your resume has been successfully analyzed and is ready for job matching.
                                </p>

                            </div>


                            <div className="flex gap-3 flex-wrap">

                                {atsScore !== null && (

                                    <div className="bg-blue-600 text-white rounded-xl px-5 py-3 text-center">

                                        <p className="text-xs opacity-80">
                                            ATS Score
                                        </p>


                                        <p className="text-3xl font-bold">
                                            {atsScore}%
                                        </p>

                                    </div>

                                )}


                                <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl px-5 py-3 flex items-center font-semibold">

                                    ✅ Ready

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    EXTRACTED DATA
                ================================================= */}

                {resumeData && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-6">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Extracted Resume Information
                        </h2>


                        {/* =================================================
                            CONTACT
                        ================================================= */}

                        <div className="grid md:grid-cols-3 gap-4 mb-8">

                            <div className="bg-gray-50 rounded-xl p-4">

                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Name
                                </p>


                                <p className="font-semibold text-gray-800 mt-1 break-words">
                                    {
                                        resumeData.name ||
                                        "Not available"
                                    }
                                </p>

                            </div>


                            <div className="bg-gray-50 rounded-xl p-4">

                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Email
                                </p>


                                <p className="font-semibold text-gray-800 mt-1 break-words">
                                    {
                                        resumeData.email ||
                                        "Not available"
                                    }
                                </p>

                            </div>


                            <div className="bg-gray-50 rounded-xl p-4">

                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Phone
                                </p>


                                <p className="font-semibold text-gray-800 mt-1 break-words">
                                    {
                                        resumeData.phone ||
                                        "Not available"
                                    }
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <section className="mb-8">

                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                Skills
                            </h3>


                            {Array.isArray(
                                resumeData.skills
                            ) &&
                            resumeData.skills.length > 0 ? (

                                <div className="flex flex-wrap gap-2">

                                    {resumeData.skills.map(

                                        (
                                            skill,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    `${skill}-${index}`
                                                }
                                                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>

                                        )

                                    )}

                                </div>

                            ) : (

                                <p className="text-gray-500">
                                    No skills found.
                                </p>

                            )}

                        </section>


                        {/* =================================================
                            EDUCATION
                        ================================================= */}

                        <section className="mb-8">

                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                Education
                            </h3>


                            {Array.isArray(
                                resumeData.education
                            ) &&
                            resumeData.education.length > 0 ? (

                                <div className="space-y-3">

                                    {resumeData.education.map(

                                        (
                                            edu,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="border border-gray-200 rounded-xl p-4"
                                            >

                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        edu.institution ||
                                                        "Institution not available"
                                                    }
                                                </p>


                                                <p className="text-gray-600 mt-1">
                                                    {
                                                        edu.degree ||
                                                        "Degree not available"
                                                    }
                                                </p>


                                                {edu.dates && (

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {edu.dates}
                                                    </p>

                                                )}


                                                {edu.cgpa && (

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        CGPA / Percentage:{" "}
                                                        {edu.cgpa}
                                                    </p>

                                                )}

                                            </div>

                                        )

                                    )}

                                </div>

                            ) : (

                                <p className="text-gray-500">
                                    No education found.
                                </p>

                            )}

                        </section>


                        {/* =================================================
                            EXPERIENCE
                        ================================================= */}

                        <section className="mb-8">

                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                Experience
                            </h3>


                            {Array.isArray(
                                resumeData.experience
                            ) &&
                            resumeData.experience.length > 0 ? (

                                <div className="space-y-3">

                                    {resumeData.experience.map(

                                        (
                                            exp,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="border border-gray-200 rounded-xl p-4"
                                            >

                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        exp.title ||
                                                        "Title not available"
                                                    }
                                                </p>


                                                <p className="text-blue-600 mt-1">
                                                    {
                                                        exp.organization ||
                                                        "Organization not available"
                                                    }
                                                </p>


                                                {exp.dates && (

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {exp.dates}
                                                    </p>

                                                )}


                                                <p className="text-gray-600 mt-3 leading-relaxed">
                                                    {
                                                        exp.description ||
                                                        "No description available"
                                                    }
                                                </p>

                                            </div>

                                        )

                                    )}

                                </div>

                            ) : (

                                <p className="text-gray-500">
                                    No experience found.
                                </p>

                            )}

                        </section>


                        {/* =================================================
                            PROJECTS
                        ================================================= */}

                        <section className="mb-8">

                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                Projects
                            </h3>


                            {Array.isArray(
                                resumeData.projects
                            ) &&
                            resumeData.projects.length > 0 ? (

                                <div className="space-y-3">

                                    {resumeData.projects.map(

                                        (
                                            project,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="border border-gray-200 rounded-xl p-4"
                                            >

                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        project.title ||
                                                        "Project title not available"
                                                    }
                                                </p>


                                                <p className="text-gray-600 mt-2 leading-relaxed">
                                                    {
                                                        project.description ||
                                                        "No description available"
                                                    }
                                                </p>


                                                {Array.isArray(
                                                    project.technologies
                                                ) &&
                                                project.technologies.length > 0 && (

                                                    <div className="flex flex-wrap gap-2 mt-3">

                                                        {project.technologies.map(

                                                            (
                                                                technology,
                                                                techIndex
                                                            ) => (

                                                                <span
                                                                    key={
                                                                        `${technology}-${techIndex}`
                                                                    }
                                                                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                                                                >
                                                                    {technology}
                                                                </span>

                                                            )

                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        )

                                    )}

                                </div>

                            ) : (

                                <p className="text-gray-500">
                                    No projects found.
                                </p>

                            )}

                        </section>


                        {/* =================================================
                            CERTIFICATIONS
                        ================================================= */}

                        <section>

                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                Certifications
                            </h3>


                            {Array.isArray(
                                resumeData.certifications
                            ) &&
                            resumeData.certifications.length > 0 ? (

                                <ul className="space-y-2">

                                    {resumeData.certifications.map(

                                        (
                                            certification,
                                            index
                                        ) => (

                                            <li
                                                key={
                                                    index
                                                }
                                                className="flex items-start gap-2 text-gray-700"
                                            >

                                                <span className="text-green-600">
                                                    ✓
                                                </span>


                                                <span>
                                                    {certification}
                                                </span>

                                            </li>

                                        )

                                    )}

                                </ul>

                            ) : (

                                <p className="text-gray-500">
                                    No certifications found.
                                </p>

                            )}

                        </section>


                        {/* =================================================
                            FINAL
                        ================================================= */}

                        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">

                            <p className="text-green-700 font-semibold">
                                ✅ Resume Analysis Complete
                            </p>


                            <p className="text-green-600 text-sm mt-1">
                                Your resume has been extracted successfully.
                                You can now continue to Job Matches.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </Layout>

    );

};


export default UploadResume;