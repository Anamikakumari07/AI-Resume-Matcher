import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function JobDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    const [saved, setSaved] = useState(false);

    const [applying, setApplying] = useState(false);

    const [applied, setApplied] = useState(false);


    // =====================================================
    // FETCH JOB
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Job ID is missing."
            );

            setLoading(false);

            return;

        }


        fetchJob();

    }, [id]);


    // =====================================================
    // FETCH JOB DETAILS
    // =====================================================

    const fetchJob = async () => {

        try {

            setLoading(true);

            setError("");


            const res =
                await API.get(
                    `/jobs/${id}`
                );


            console.log(
                "Job Details Response:",
                res.data
            );


            const jobData =
                res.data?.job ||
                res.data?.data ||
                res.data;


            if (!jobData) {

                setError(
                    "Job details not found."
                );

                return;

            }


            setJob(
                jobData
            );


        } catch (error) {

            console.log(
                "Job Details Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to load job.";


            setError(
                message
            );


            toast.error(
                message
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SAVE JOB
    // =====================================================

    const saveJob = async () => {

        if (!job) {
            return;
        }


        try {

            setSaving(true);


            const payload = {

                jobId:
                    job._id ||
                    job.id ||
                    id,

                title:
                    job.title ||
                    "",

                company:
                    job.company ||
                    "",

                location:
                    job.location ||
                    "",

                description:
                    job.description ||
                    "",

                requirements:
                    job.requirements ||
                    "",

                skills:
                    Array.isArray(
                        job.skills
                    )
                        ? job.skills
                        : [],

                matchPercentage:
                    Number(
                        job.matchPercentage
                    ) || 0,

                reason:
                    job.reason ||
                    "",

                matchingSkills:
                    Array.isArray(
                        job.matchingSkills
                    )
                        ? job.matchingSkills
                        : [],

                missingSkills:
                    Array.isArray(
                        job.missingSkills
                    )
                        ? job.missingSkills
                        : [],

            };


            const res =
                await API.post(
                    "/saved-jobs/save",
                    payload
                );


            console.log(
                "Save Job Response:",
                res.data
            );


            setSaved(true);


            toast.success(
                res.data?.message ||
                "Job saved successfully!"
            );


        } catch (error) {

            console.log(
                "Save Job Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to save job.";


            if (
                message
                    .toLowerCase()
                    .includes("already")
            ) {

                setSaved(true);

            }


            toast.error(
                message
            );


        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // APPLY JOB
    // =====================================================

    const applyToJob = async () => {

        if (!job) {

            toast.error(
                "Job information is unavailable."
            );

            return;

        }


        if (
            applied
        ) {

            toast(
                "You have already applied to this job."
            );

            return;

        }


        try {

            setApplying(true);


            const payload = {

    jobId:
        job._id ||
        job.id ||
        id,

    company:
        job.company ||
        "Unknown Company",

    position:
        job.title ||
        "Untitled Job",

    location:
        job.location ||
        "Not Specified",

    salary:
        job.salary ||
        "Not Disclosed",

    jobType:
        job.type ||
        job.jobType ||
        "Full Time",

};


            console.log(
                "Apply Job Payload:",
                payload
            );


            const res =
                await API.post(
                    "/applications/apply",
                    payload
                );


            console.log(
                "Apply Job Response:",
                res.data
            );


            setApplied(
                true
            );


            toast.success(
                res.data?.message ||
                "Application submitted successfully!"
            );


        } catch (error) {

            console.log(
                "Apply Job Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to submit application.";


            if (
                message
                    .toLowerCase()
                    .includes("already applied")
            ) {

                setApplied(
                    true
                );

            }


            toast.error(
                message
            );


        } finally {

            setApplying(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <div className="text-5xl mb-4">
                        ⏳
                    </div>


                    <h2 className="text-xl font-semibold text-gray-700">
                        Loading job details...
                    </h2>


                    <p className="text-gray-500 mt-2">
                        Please wait while we load the job.
                    </p>

                </div>

            </Layout>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Layout>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                    <div className="flex items-start gap-4">

                        <div className="text-3xl">
                            ⚠️
                        </div>


                        <div>

                            <h2 className="text-xl font-semibold text-red-700">
                                Unable to load job
                            </h2>


                            <p className="mt-2 text-red-600">
                                {error}
                            </p>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/jobs"
                                    )
                                }
                                className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Back to Job Matches
                            </button>

                        </div>

                    </div>

                </div>

            </Layout>

        );

    }


    // =====================================================
    // JOB NOT FOUND
    // =====================================================

    if (!job) {

        return (

            <Layout>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <div className="text-5xl mb-4">
                        🔍
                    </div>


                    <h2 className="text-2xl font-bold text-gray-800">
                        Job Not Found
                    </h2>


                    <p className="text-gray-500 mt-2">
                        This job may have been removed.
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/job-matches"
                            )
                        }
                        className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Job Matches
                    </button>

                </div>

            </Layout>

        );

    }


    // =====================================================
    // NORMALIZE SKILLS
    // =====================================================

    const skills =
        Array.isArray(
            job.skills
        )
            ? job.skills
            : [];


    // =====================================================
    // MATCH INFORMATION
    // =====================================================

    const matchPercentage =
        Number(
            job.matchPercentage
        ) || 0;


    const matchingSkills =
        Array.isArray(
            job.matchingSkills
        )
            ? job.matchingSkills
            : [];


    const missingSkills =
        Array.isArray(
            job.missingSkills
        )
            ? job.missingSkills
            : [];


    // =====================================================
    // MATCH COLOR
    // =====================================================

    const matchColor =
        matchPercentage >= 80
            ? "text-green-600 bg-green-50 border-green-200"
            : matchPercentage >= 60
            ? "text-yellow-600 bg-yellow-50 border-yellow-200"
            : "text-red-600 bg-red-50 border-red-200";


    return (

        <Layout>

            <div className="max-w-5xl mx-auto">

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    onClick={() =>
                        navigate(
                            "/job-matches"
                        )
                    }
                    className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Back to Job Matches
                </button>


                {/* =================================================
                    JOB HEADER
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                        <div>

                            <h1 className="text-4xl font-bold text-gray-800">
                                {job.title ||
                                    "Untitled Job"}
                            </h1>


                            <p className="text-blue-600 font-semibold text-xl mt-2">
                                {job.company ||
                                    "Unknown Company"}
                            </p>


                            {job.location && (

                                <p className="text-gray-500 mt-3">
                                    📍 {job.location}
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            MATCH SCORE
                        ================================================= */}

                        {matchPercentage > 0 && (

                            <div
                                className={`px-6 py-4 rounded-xl border text-center ${matchColor}`}
                            >

                                <p className="text-sm font-medium">
                                    Resume Match
                                </p>


                                <p className="text-4xl font-bold">
                                    {matchPercentage}%
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="flex flex-wrap gap-3 mt-7">

                        {/* SAVE */}

                        <button
                            onClick={
                                saveJob
                            }
                            disabled={
                                saving ||
                                saved
                            }
                            className={`px-6 py-3 rounded-lg font-medium transition ${
                                saved
                                    ? "bg-green-50 text-green-600 border border-green-200"
                                    : saving
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >

                            {saved
                                ? "✅ Saved"
                                : saving
                                ? "Saving..."
                                : "🔖 Save Job"}

                        </button>


                        {/* APPLY */}

                        <button
                            onClick={
                                applyToJob
                            }
                            disabled={
                                applying ||
                                applied
                            }
                            className={`px-6 py-3 rounded-lg font-medium transition ${
                                applied
                                    ? "bg-green-50 text-green-600 border border-green-200"
                                    : applying
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >

                            {applied
                                ? "✅ Applied"
                                : applying
                                ? "Applying..."
                                : "📤 Apply Now"}

                        </button>


                        {/* EXTERNAL APPLY LINK */}

                        {job.applyUrl && (

                            <a
                                href={
                                    job.applyUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition font-medium"
                            >
                                🌐 External Application
                            </a>

                        )}

                    </div>

                </div>


                {/* =================================================
                    JOB DESCRIPTION
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Job Description
                    </h2>


                    <div className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">

                        {job.description ||
                            "No job description available."}

                    </div>

                </div>


                {/* =================================================
                    REQUIRED SKILLS
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Required Skills
                    </h2>


                    {skills.length > 0 ? (

                        <div className="flex flex-wrap gap-3 mt-4">

                            {skills.map(
                                (
                                    skill,
                                    index
                                ) => (

                                    <span
                                        key={
                                            index
                                        }
                                        className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <p className="text-gray-500 mt-3">
                            No specific skills listed.
                        </p>

                    )}

                </div>


                {/* =================================================
                    REQUIREMENTS
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Requirements
                    </h2>


                    {Array.isArray(
                        job.requirements
                    ) ? (

                        job.requirements.length > 0 ? (

                            <ul className="mt-4 space-y-3">

                                {job.requirements.map(
                                    (
                                        requirement,
                                        index
                                    ) => (

                                        <li
                                            key={
                                                index
                                            }
                                            className="flex items-start gap-3 text-gray-600"
                                        >

                                            <span className="text-blue-600 mt-1">
                                                •
                                            </span>


                                            <span>
                                                {
                                                    requirement
                                                }
                                            </span>

                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <p className="text-gray-500 mt-3">
                                No specific requirements listed.
                            </p>

                        )

                    ) : (

                        <p className="text-gray-600 mt-4 whitespace-pre-line">
                            {job.requirements ||
                                "No specific requirements listed."}
                        </p>

                    )}

                </div>


                {/* =================================================
                    AI MATCH ANALYSIS
                ================================================= */}

                {(matchingSkills.length > 0 ||
                    missingSkills.length > 0 ||
                    job.reason) && (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">

                        <div className="flex items-center gap-2 mb-5">

                            <span className="text-2xl">
                                🤖
                            </span>


                            <h2 className="text-2xl font-bold text-gray-800">
                                Resume Match Analysis
                            </h2>

                        </div>


                        {job.reason && (

                            <div className="bg-gray-50 rounded-xl p-5 mb-5">

                                <p className="text-gray-600 leading-relaxed">
                                    {job.reason}
                                </p>

                            </div>

                        )}


                        {matchingSkills.length > 0 && (

                            <div className="mb-5">

                                <h3 className="font-semibold text-green-700 mb-3">
                                    ✅ Matching Skills
                                </h3>


                                <div className="flex flex-wrap gap-2">

                                    {matchingSkills.map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    index
                                                }
                                                className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {missingSkills.length > 0 && (

                            <div>

                                <h3 className="font-semibold text-red-700 mb-3">
                                    ❌ Missing Skills
                                </h3>


                                <div className="flex flex-wrap gap-2">

                                    {missingSkills.map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    index
                                                }
                                                className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </Layout>

    );

}

export default JobDetails;