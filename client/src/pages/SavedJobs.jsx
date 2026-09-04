import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";


function SavedJobs() {

    const navigate = useNavigate();


    const [savedJobs, setSavedJobs] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const [deletingJob, setDeletingJob] =
        useState(null);


    // =====================================================
    // FETCH SAVED JOBS
    // =====================================================

    useEffect(() => {

        fetchSavedJobs();

    }, []);


    const fetchSavedJobs =
        async () => {

            try {

                setLoading(true);

                setError("");


                const res =
                    await API.get(
                        "/saved-jobs"
                    );


                console.log(
                    "Saved Jobs:",
                    res.data
                );


                setSavedJobs(

                    Array.isArray(
                        res.data?.savedJobs
                    )

                        ? res.data.savedJobs

                        : []

                );


            } catch (error) {

                console.log(
                    "Fetch Saved Jobs Error:",
                    error
                );


                const message =
                    error.response?.data?.message ||
                    "Unable to load saved jobs.";


                setError(message);

                toast.error(
                    message
                );


            } finally {

                setLoading(false);

            }

        };


    // =====================================================
    // DELETE SAVED JOB
    // =====================================================

    const deleteJob =
        async (
            savedJobId
        ) => {

            if (
                !window.confirm(
                    "Remove this job from saved jobs?"
                )
            ) {

                return;

            }


            try {

                setDeletingJob(
                    savedJobId
                );


                await API.delete(

                    `/saved-jobs/${savedJobId}`

                );


                setSavedJobs(

                    previousJobs =>

                        previousJobs.filter(

                            savedJob =>

                                savedJob._id !==
                                savedJobId

                        )

                );


                toast.success(
                    "Job removed from saved jobs."
                );


            } catch (error) {

                console.log(
                    "Delete Saved Job Error:",
                    error
                );


                const message =
                    error.response?.data?.message ||
                    "Unable to remove saved job.";


                toast.error(
                    message
                );


            } finally {

                setDeletingJob(
                    null
                );

            }

        };


    // =====================================================
    // VIEW JOB
    // =====================================================

    const viewJob =
        (
            savedJob
        ) => {

            const jobId =
                savedJob?.job?._id;


            if (!jobId) {

                toast.error(
                    "Job information is unavailable."
                );

                return;

            }


            navigate(
                `/jobs/${jobId}`
            );

        };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate =
        (
            date
        ) => {

            if (!date) {

                return "Recently";

            }


            const parsedDate =
                new Date(
                    date
                );


            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {

                return "Recently";

            }


            return parsedDate.toLocaleDateString(

                "en-IN",

                {

                    day:
                        "numeric",

                    month:
                        "short",

                    year:
                        "numeric"

                }

            );

        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="min-h-[60vh] flex items-center justify-center">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center w-full max-w-md">

                        <div className="text-4xl mb-4">
                            📌
                        </div>


                        <h2 className="text-xl font-semibold text-gray-700">
                            Loading saved jobs...
                        </h2>


                        <p className="text-gray-500 mt-2">
                            Please wait while we fetch your saved jobs.
                        </p>

                    </div>

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

                <div className="max-w-5xl mx-auto">

                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                        <div className="flex items-start gap-4">

                            <div className="text-3xl">
                                ⚠️
                            </div>


                            <div>

                                <h2 className="text-lg font-semibold text-red-700">
                                    Unable to load saved jobs
                                </h2>


                                <p className="text-red-600 mt-1">
                                    {error}
                                </p>


                                <button
                                    onClick={
                                        fetchSavedJobs
                                    }
                                    className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Try Again
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </Layout>

        );

    }


    return (

        <Layout>

            <div className="max-w-5xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-gray-800">
                        Saved Jobs
                    </h1>


                    <p className="text-gray-500 mt-2">
                        Keep track of the jobs you are interested in.
                    </p>

                </div>


                {/* =================================================
                    SAVED JOB COUNT
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Saved Jobs
                            </p>


                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                {savedJobs.length}
                            </p>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                            🔖
                        </div>

                    </div>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {savedJobs.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                        <div className="text-6xl mb-5">
                            🔖
                        </div>


                        <h2 className="text-2xl font-bold text-gray-800">
                            No Saved Jobs
                        </h2>


                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            You haven't saved any jobs yet.
                            Go to Job Matches and save jobs
                            you're interested in.
                        </p>


                        <button
                            onClick={() =>
                                navigate(
                                    "/jobs"
                                )
                            }
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Find Jobs
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       SAVED JOB LIST
                    ================================================= */

                    <div className="space-y-5">

                        {savedJobs.map(

                            (
                                savedJob
                            ) => {

                                const job =
                                    savedJob?.job;


                                if (!job) {

                                    return null;

                                }


                                return (

                                    <div
                                        key={
                                            savedJob._id
                                        }
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                                    >

                                        {/* =================================================
                                            JOB INFORMATION
                                        ================================================= */}

                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                                            <div>

                                                <h2 className="text-2xl font-bold text-gray-800">
                                                    {
                                                        job.title ||
                                                        "Untitled Job"
                                                    }
                                                </h2>


                                                <p className="text-blue-600 font-medium mt-1">
                                                    {
                                                        job.company ||
                                                        "Company not specified"
                                                    }
                                                </p>


                                                {job.location && (

                                                    <p className="text-gray-500 mt-1">
                                                        📍{" "}
                                                        {
                                                            job.location
                                                        }
                                                    </p>

                                                )}

                                            </div>


                                            {/* =================================================
                                                SAVED DATE
                                            ================================================= */}

                                            <div className="text-sm text-gray-400">

                                                Saved on{" "}

                                                {formatDate(
                                                    savedJob.createdAt
                                                )}

                                            </div>

                                        </div>


                                        {/* =================================================
                                            MATCH SCORE
                                        ================================================= */}

                                        {savedJob.matchPercentage !==
                                            undefined && (

                                            <div className="mt-5">

                                                <span className="inline-flex px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">

                                                    {
                                                        savedJob.matchPercentage
                                                    }%
                                                    Match

                                                </span>

                                            </div>

                                        )}


                                        {/* =================================================
                                            DESCRIPTION
                                        ================================================= */}

                                        {job.description && (

                                            <div className="mt-5">

                                                <p className="text-gray-600 leading-relaxed">
                                                    {
                                                        job.description
                                                    }
                                                </p>

                                            </div>

                                        )}


                                        {/* =================================================
                                            SKILLS
                                        ================================================= */}

                                        {Array.isArray(
                                            job.skills
                                        ) &&
                                        job.skills.length > 0 && (

                                            <div className="mt-5">

                                                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                                    Required Skills
                                                </h3>


                                                <div className="flex flex-wrap gap-2">

                                                    {job.skills.map(

                                                        (
                                                            skill,
                                                            index
                                                        ) => (

                                                            <span
                                                                key={
                                                                    `${skill}-${index}`
                                                                }
                                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm"
                                                            >
                                                                {skill}
                                                            </span>

                                                        )

                                                    )}

                                                </div>

                                            </div>

                                        )}


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <div className="flex flex-wrap gap-3 mt-6">

                                            <button
                                                onClick={() =>
                                                    viewJob(
                                                        savedJob
                                                    )
                                                }
                                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                View Job
                                            </button>


                                            <button
                                                onClick={() =>
                                                    deleteJob(
                                                        savedJob._id
                                                    )
                                                }
                                                disabled={
                                                    deletingJob ===
                                                    savedJob._id
                                                }
                                                className={`px-5 py-2.5 rounded-lg transition ${
                                                    deletingJob ===
                                                    savedJob._id

                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"

                                                        : "border border-red-200 text-red-600 hover:bg-red-50"
                                                }`}
                                            >

                                                {
                                                    deletingJob ===
                                                    savedJob._id

                                                        ? "Removing..."

                                                        : "🗑️ Remove"
                                                }

                                            </button>

                                        </div>

                                    </div>

                                );

                            }

                        )}

                    </div>

                )}

            </div>

        </Layout>

    );

}


export default SavedJobs;