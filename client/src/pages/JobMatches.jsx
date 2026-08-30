import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function JobMatches() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [savingJob, setSavingJob] = useState(null);

    const [savedJobs, setSavedJobs] = useState([]);

    // =====================================================
    // FILTER + SORT
    // =====================================================

    const [matchFilter, setMatchFilter] =
        useState("all");

    const [sortOption, setSortOption] =
        useState("highest");


    // =====================================================
    // PREVENT DUPLICATE INITIAL API CALL
    // =====================================================

    const hasFetched =
        useRef(false);


    // =====================================================
    // FETCH JOB MATCHES ONCE
    // =====================================================

    useEffect(() => {

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        fetchJobMatches();

    }, []);


    // =====================================================
    // FETCH JOB MATCHES
    // =====================================================

    const fetchJobMatches = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "Fetching job matches..."
            );


            const res =
                await API.post(
                    "/job-match/match"
                );


            console.log(
                "Job Match Response:",
                res.data
            );


            const matches =
                res.data?.bestMatches ||
                res.data?.matches ||
                res.data?.jobMatches ||
                [];


            setJobs(
                Array.isArray(matches)
                    ? matches
                    : []
            );


        } catch (error) {

            console.log(
                "Job Matching Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to load job matches.";


            setError(message);

            toast.error(message);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GET JOB ID
    // =====================================================

    const getJobId = (job) => {

        if (!job) {
            return null;
        }


        if (job.jobId) {
            return job.jobId;
        }


        if (job._id) {
            return job._id;
        }


        if (job.id) {
            return job.id;
        }


        if (job.job?.jobId) {
            return job.job.jobId;
        }


        if (job.job?._id) {
            return job.job._id;
        }


        if (job.job?.id) {
            return job.job.id;
        }


        return null;

    };


    // =====================================================
    // FETCH SAVED JOBS
    // =====================================================

    const fetchSavedJobs = async () => {

        try {

            const res =
                await API.get(
                    "/saved-jobs"
                );


            console.log(
                "Saved Jobs Response:",
                res.data
            );


            const saved =
                res.data?.savedJobs ||
                res.data?.jobs ||
                [];


            if (
                Array.isArray(saved)
            ) {

                const ids =
                    saved
                        .map(
                            (item) =>
                                item.jobId ||
                                item.job?._id ||
                                item.job?.jobId ||
                                item._id
                        )
                        .filter(Boolean)
                        .map(String);


                setSavedJobs(
                    ids
                );

            }

        } catch (error) {

            console.log(
                "Fetch Saved Jobs Error:",
                error
            );

        }

    };


    // =====================================================
    // FETCH SAVED JOBS ONCE
    // =====================================================

    const hasFetchedSaved =
        useRef(false);


    useEffect(() => {

        if (hasFetchedSaved.current) {
            return;
        }

        hasFetchedSaved.current = true;

        fetchSavedJobs();

    }, []);


    // =====================================================
    // CHECK SAVED
    // =====================================================

    const isJobSaved = (job) => {

        const jobId =
            getJobId(job);


        if (!jobId) {
            return false;
        }


        return savedJobs.includes(
            String(jobId)
        );

    };


    // =====================================================
    // SAVE JOB
    // =====================================================

    const saveJob = async (job) => {

        try {

            console.log(
                "================================="
            );

            console.log(
                "Saving Job"
            );

            console.log(
                "Complete Job Object:",
                job
            );

            console.log(
                "================================="
            );


            const jobId =
                getJobId(job);


            console.log(
                "Detected Job ID:",
                jobId
            );


            if (!jobId) {

                toast.error(
                    "Job ID is missing. Cannot save this job."
                );

                return;

            }


            if (
                isJobSaved(job)
            ) {

                toast(
                    "Job is already saved."
                );

                return;

            }


            setSavingJob(
                String(jobId)
            );


            const payload = {

                jobId:

                    jobId,

                title:

                    job.title ||
                    job.job?.title ||
                    "Untitled Job",

                company:

                    job.company ||
                    job.job?.company ||
                    "Unknown Company",

                location:

                    job.location ||
                    job.job?.location ||
                    "",

                matchPercentage:

                    Number(
                        job.matchPercentage
                    ) || 0,

                reason:

                    job.reason ||
                    job.analysis ||
                    job.job?.reason ||
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

                missingKeywords:

                    Array.isArray(
                        job.missingKeywords
                    )
                        ? job.missingKeywords
                        : [],

                suggestions:

                    Array.isArray(
                        job.suggestions
                    )
                        ? job.suggestions
                        : [],

                recommendations:

                    Array.isArray(
                        job.recommendations
                    )
                        ? job.recommendations
                        : [],

            };


            console.log(
                "Save Job Payload:",
                payload
            );


            const response =
                await API.post(
                    "/saved-jobs/save",
                    payload
                );


            console.log(
                "Save Job Response:",
                response.data
            );


            setSavedJobs(
                (previous) => [
                    ...previous,
                    String(jobId),
                ]
            );


            toast.success(
                response.data?.message ||
                "Job saved successfully!"
            );


        } catch (error) {

            console.log(
                "================================="
            );

            console.log(
                "Save Job Error:",
                error
            );

            console.log(
                "Backend Response:",
                error.response?.data
            );

            console.log(
                "================================="
            );


            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to save job.";


            toast.error(
                message
            );


        } finally {

            setSavingJob(
                null
            );

        }

    };


    // =====================================================
    // VIEW JOB
    // =====================================================

    const viewJob = (job) => {

        const jobId =
            getJobId(job);


        if (!jobId) {

            toast.error(
                "Job ID is missing."
            );

            return;

        }


        navigate(
            `/jobs/${jobId}`
        );

    };


    // =====================================================
    // MATCH COLOR
    // =====================================================

    const getMatchColor =
        (percentage) => {

            if (
                percentage >= 80
            ) {

                return "text-green-600 bg-green-50 border-green-200";

            }


            if (
                percentage >= 60
            ) {

                return "text-yellow-600 bg-yellow-50 border-yellow-200";

            }


            return "text-red-600 bg-red-50 border-red-200";

        };


    // =====================================================
    // FILTER JOBS
    // =====================================================

    const filteredJobs =
        jobs.filter((job) => {

            const percentage =
                Number(
                    job.matchPercentage
                ) || 0;


            if (
                matchFilter === "80"
            ) {

                return percentage >= 80;

            }


            if (
                matchFilter === "60"
            ) {

                return (
                    percentage >= 60 &&
                    percentage < 80
                );

            }


            if (
                matchFilter === "below60"
            ) {

                return percentage < 60;

            }


            return true;

        });


    // =====================================================
    // SORT JOBS
    // =====================================================

    const sortedJobs =
        [...filteredJobs].sort(
            (a, b) => {

                const scoreA =
                    Number(
                        a.matchPercentage
                    ) || 0;


                const scoreB =
                    Number(
                        b.matchPercentage
                    ) || 0;


                if (
                    sortOption === "highest"
                ) {

                    return (
                        scoreB -
                        scoreA
                    );

                }


                if (
                    sortOption === "lowest"
                ) {

                    return (
                        scoreA -
                        scoreB
                    );

                }


                if (
                    sortOption === "az"
                ) {

                    return (
                        (a.title || "")
                            .toLowerCase()
                            .localeCompare(
                                (
                                    b.title ||
                                    ""
                                )
                                    .toLowerCase()
                            )
                    );

                }


                if (
                    sortOption === "za"
                ) {

                    return (
                        (b.title || "")
                            .toLowerCase()
                            .localeCompare(
                                (
                                    a.title ||
                                    ""
                                )
                                    .toLowerCase()
                            )
                    );

                }


                return 0;

            }
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <div className="text-5xl mb-4">
                        🤖
                    </div>


                    <h2 className="text-xl font-semibold text-gray-700">
                        Finding your best job matches...
                    </h2>


                    <p className="text-gray-500 mt-2">
                        AI is comparing your resume with available jobs.
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


                        <div className="flex-1">

                            <h2 className="text-lg font-semibold text-red-700">
                                Unable to load job matches
                            </h2>


                            <p className="text-red-600 mt-2">
                                {error}
                            </p>


                            <button
                                onClick={() => {

                                    fetchJobMatches();

                                }}
                                className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </div>

            </Layout>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <Layout>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Job Matches
                </h1>


                <p className="text-gray-500 mt-2">
                    Jobs ranked according to how well they match your resume.
                </p>

            </div>


            {/* =================================================
                FILTER + SORT
            ================================================= */}

            {jobs.length > 0 && (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* FILTER */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Filter by Match
                            </label>


                            <select
                                value={
                                    matchFilter
                                }
                                onChange={(e) => {

                                    setMatchFilter(
                                        e.target.value
                                    );

                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="all">
                                    All Matches
                                </option>

                                <option value="80">
                                    80% and above
                                </option>

                                <option value="60">
                                    60% - 79%
                                </option>

                                <option value="below60">
                                    Below 60%
                                </option>

                            </select>

                        </div>


                        {/* SORT */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sort Jobs
                            </label>


                            <select
                                value={
                                    sortOption
                                }
                                onChange={(e) => {

                                    setSortOption(
                                        e.target.value
                                    );

                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="highest">
                                    Highest Match
                                </option>

                                <option value="lowest">
                                    Lowest Match
                                </option>

                                <option value="az">
                                    Job Title A-Z
                                </option>

                                <option value="za">
                                    Job Title Z-A
                                </option>

                            </select>

                        </div>


                        {/* RESULT COUNT */}

                        <div className="text-sm text-gray-500">

                            Showing{" "}

                            <span className="font-semibold text-gray-800">

                                {
                                    sortedJobs.length
                                }

                            </span>

                            {" "}of{" "}

                            <span className="font-semibold text-gray-800">

                                {
                                    jobs.length
                                }

                            </span>

                            {" "}jobs

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                EMPTY AFTER FILTER
            ================================================= */}

            {jobs.length > 0 &&
            sortedJobs.length === 0 ? (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <div className="text-6xl mb-5">
                        🔍
                    </div>


                    <h2 className="text-2xl font-bold text-gray-800">
                        No Jobs Match This Filter
                    </h2>


                    <p className="text-gray-500 mt-2">
                        Try selecting a different match range.
                    </p>


                    <button
                        onClick={() => {

                            setMatchFilter(
                                "all"
                            );

                        }}
                        className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Show All Jobs
                    </button>

                </div>

            ) : jobs.length === 0 ? (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <div className="text-6xl mb-5">
                        🔍
                    </div>


                    <h2 className="text-2xl font-bold text-gray-800">
                        No Job Matches Found
                    </h2>


                    <p className="text-gray-500 mt-2">
                        We couldn't find any jobs matching your resume.
                    </p>


                    <button
                        onClick={() => {

                            fetchJobMatches();

                        }}
                        className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Refresh Matches
                    </button>

                </div>

            ) : (

                /* =================================================
                   JOB LIST
                ================================================= */

                <div className="space-y-8">

                    {sortedJobs.map(
                        (job, index) => {

                            const jobId =
                                getJobId(job);


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


                            const missingKeywords =
                                Array.isArray(
                                    job.missingKeywords
                                )
                                    ? job.missingKeywords
                                    : [];


                            const suggestions =
                                Array.isArray(
                                    job.suggestions
                                )
                                    ? job.suggestions
                                    : [];


                            const recommendations =
                                Array.isArray(
                                    job.recommendations
                                )
                                    ? job.recommendations
                                    : [];


                            const saved =
                                isJobSaved(job);


                            return (

                                <div
                                    key={
                                        jobId ||
                                        index
                                    }
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                                >

                                    {/* JOB HEADER */}

                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                                        <div>

                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {job.title ||
                                                    job.job?.title ||
                                                    "Untitled Job"}
                                            </h2>


                                            <p className="text-blue-600 font-semibold mt-1">
                                                {job.company ||
                                                    job.job?.company ||
                                                    "Unknown Company"}
                                            </p>


                                            {(job.location ||
                                                job.job?.location) && (

                                                <p className="text-gray-500 mt-2">

                                                    📍{" "}

                                                    {
                                                        job.location ||
                                                        job.job?.location
                                                    }

                                                </p>

                                            )}

                                        </div>


                                        {/* MATCH SCORE */}

                                        <div
                                            className={`px-6 py-3 rounded-xl border text-center ${getMatchColor(
                                                matchPercentage
                                            )}`}
                                        >

                                            <p className="text-xs font-medium">
                                                Resume Match
                                            </p>


                                            <p className="text-3xl font-bold">
                                                {matchPercentage}%
                                            </p>

                                        </div>

                                    </div>


                                    {/* PROGRESS */}

                                    <div className="mt-6">

                                        <div className="flex justify-between text-sm mb-2">

                                            <span className="text-gray-500">
                                                Compatibility
                                            </span>


                                            <span className="font-semibold text-gray-700">
                                                {matchPercentage}%
                                            </span>

                                        </div>


                                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">

                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    matchPercentage >= 80
                                                        ? "bg-green-500"
                                                        : matchPercentage >= 60
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                                style={{
                                                    width:
                                                        `${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                matchPercentage
                                                            )
                                                        )}%`,
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* AI ANALYSIS */}

                                    <div className="mt-7">

                                        <div className="flex items-center gap-2 mb-3">

                                            <span className="text-2xl">
                                                🤖
                                            </span>


                                            <h3 className="text-xl font-bold text-gray-800">
                                                AI Analysis
                                            </h3>

                                        </div>


                                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">

                                            <p className="text-gray-600 leading-relaxed">

                                                {job.reason ||
                                                    job.analysis ||
                                                    `Your resume has a ${matchPercentage}% match for this position.`}

                                            </p>

                                        </div>


                                        {/* MATCHING SKILLS */}

                                        {matchingSkills.length > 0 && (

                                            <div className="mt-5">

                                                <h4 className="font-semibold text-green-700 mb-3">
                                                    ✅ Matching Skills
                                                </h4>


                                                <div className="flex flex-wrap gap-2">

                                                    {matchingSkills.map(
                                                        (
                                                            skill,
                                                            skillIndex
                                                        ) => (

                                                            <span
                                                                key={
                                                                    skillIndex
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


                                        {/* MISSING SKILLS */}

                                        {missingSkills.length > 0 && (

                                            <div className="mt-5">

                                                <h4 className="font-semibold text-red-700 mb-3">
                                                    ❌ Missing Skills
                                                </h4>


                                                <div className="flex flex-wrap gap-2">

                                                    {missingSkills.map(
                                                        (
                                                            skill,
                                                            skillIndex
                                                        ) => (

                                                            <span
                                                                key={
                                                                    skillIndex
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


                                        {/* MISSING KEYWORDS */}

                                        {missingKeywords.length > 0 && (

                                            <div className="mt-5">

                                                <h4 className="font-semibold text-orange-700 mb-3">
                                                    🔑 Missing Keywords
                                                </h4>


                                                <div className="flex flex-wrap gap-2">

                                                    {missingKeywords.map(
                                                        (
                                                            keyword,
                                                            keywordIndex
                                                        ) => (

                                                            <span
                                                                key={
                                                                    keywordIndex
                                                                }
                                                                className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-sm"
                                                            >
                                                                {keyword}
                                                            </span>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )}


                                        {/* SUGGESTIONS */}

                                        {suggestions.length > 0 && (

                                            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-5">

                                                <h4 className="font-semibold text-blue-700 mb-3">
                                                    💡 Resume Improvement Suggestions
                                                </h4>


                                                <ul className="space-y-2">

                                                    {suggestions.map(
                                                        (
                                                            suggestion,
                                                            suggestionIndex
                                                        ) => (

                                                            <li
                                                                key={
                                                                    suggestionIndex
                                                                }
                                                                className="flex items-start gap-2 text-gray-700"
                                                            >

                                                                <span className="text-blue-600">
                                                                    •
                                                                </span>


                                                                <span>
                                                                    {suggestion}
                                                                </span>

                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            </div>

                                        )}


                                        {/* RECOMMENDATIONS */}

                                        {recommendations.length > 0 && (

                                            <div className="mt-5 bg-purple-50 border border-purple-100 rounded-xl p-5">

                                                <h4 className="font-semibold text-purple-700 mb-3">
                                                    🎯 Job-Specific Recommendations
                                                </h4>


                                                <ul className="space-y-2">

                                                    {recommendations.map(
                                                        (
                                                            recommendation,
                                                            recommendationIndex
                                                        ) => (

                                                            <li
                                                                key={
                                                                    recommendationIndex
                                                                }
                                                                className="flex items-start gap-2 text-gray-700"
                                                            >

                                                                <span className="text-purple-600">
                                                                    •
                                                                </span>


                                                                <span>
                                                                    {recommendation}
                                                                </span>

                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            </div>

                                        )}

                                    </div>


                                    {/* ACTION BUTTONS */}

                                    <div className="flex flex-wrap gap-3 mt-7 pt-5 border-t border-gray-100">

                                        <button
                                            onClick={() =>
                                                viewJob(job)
                                            }
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                        >
                                            View Job
                                        </button>


                                        <button
                                            onClick={() =>
                                                saveJob(job)
                                            }
                                            disabled={
                                                !jobId ||
                                                savingJob ===
                                                    String(
                                                        jobId
                                                    ) ||
                                                saved
                                            }
                                            className={`px-6 py-3 rounded-lg border font-medium transition ${
                                                saved
                                                    ? "bg-green-50 text-green-600 border-green-200 cursor-not-allowed"
                                                    : savingJob ===
                                                      String(
                                                          jobId
                                                      )
                                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                                            }`}
                                        >

                                            {saved
                                                ? "✅ Saved"
                                                : savingJob ===
                                                  String(
                                                      jobId
                                                  )
                                                ? "Saving..."
                                                : "🔖 Save Job"}

                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            )}

        </Layout>

    );

}

export default JobMatches;