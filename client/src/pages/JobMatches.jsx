import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import SkeletonCard from "../components/SkeletonCard";

function JobMatches() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // AI Job Matching states
    const [jobDescription, setJobDescription] = useState("");
    const [matchResult, setMatchResult] = useState(null);
    const [matching, setMatching] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await API.get("/jobs/match");

            setJobs(res.data.bestMatches || []);
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load job matches"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // AI Resume Job Matching
    // =========================
    const analyzeJob = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please enter a job description");
            return;
        }

        try {
            setMatching(true);
            setMatchResult(null);

            /*
             * For now we use the resume text entered below.
             * Later we can automatically fetch the user's
             * latest parsed resume from MongoDB.
             */
            const resumeText = `
                Anamika Kumari
                B.Tech Electronics and Communication Engineering
                Skills:
                C, C++, JavaScript, Python, SQL,
                HTML5, CSS3, React.js, Node.js,
                Express.js, MongoDB, Postman,
                VS Code, GitHub, React Router,
                Context API, Local Storage,
                Data Structures and Algorithms,
                Operating Systems,
                Digital Signal Processing
            `;

            const res = await API.post("/job-match/match", {
                resumeText,
                jobDescription,
            });

            if (res.data.success) {
                setMatchResult(res.data.data);

                toast.success("Resume Matched Successfully");
            }
        } catch (error) {
            console.log("AI Matching Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to analyze job"
            );
        } finally {
            setMatching(false);
        }
    };

    // =========================
    // Apply Job
    // =========================
    const applyJob = async (job) => {
        try {
            await API.post("/application/apply", {
                company: job.company,
                position: job.title,
                location: job.location,
                salary: job.salary || "Not Disclosed",
                jobType: job.jobType || "Full Time",
            });

            toast.success("Application Submitted Successfully");

            navigate("/applications");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to Apply"
            );
        }
    };

    // =========================
    // Save Job
    // =========================
    const saveJob = async (job) => {
        try {
            await API.post("/saved-jobs/save", job);

            toast.success("Job Saved Successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to Save Job"
            );
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="grid md:grid-cols-2 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>

                {/* ========================= */}
                {/* PAGE TITLE */}
                {/* ========================= */}

                <h1 className="text-4xl font-bold mb-8 dark:text-white">
                    AI Job Matches
                </h1>


                {/* ========================= */}
                {/* AI JOB MATCHING */}
                {/* ========================= */}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">

                    <h2 className="text-2xl font-bold dark:text-white mb-4">
                        🤖 AI Resume Job Matcher
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Paste a job description below and Gemini AI
                        will compare it with your resume.
                    </p>

                    <textarea
                        value={jobDescription}
                        onChange={(e) =>
                            setJobDescription(e.target.value)
                        }
                        placeholder="Paste the job description here..."
                        rows="8"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700 dark:text-white"
                    />

                    <button
                        onClick={analyzeJob}
                        disabled={matching}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        {matching
                            ? "Analyzing..."
                            : "Analyze Resume Match"}
                    </button>

                </div>


                {/* ========================= */}
                {/* AI RESULT */}
                {/* ========================= */}

                {matchResult && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">

                        <h2 className="text-2xl font-bold dark:text-white mb-6">
                            📊 AI Resume Analysis
                        </h2>


                        {/* MATCH SCORE */}

                        <div className="text-center mb-8">

                            <p className="text-gray-500 dark:text-gray-300">
                                Resume Match Score
                            </p>

                            <p className="text-6xl font-bold text-purple-600 mt-2">
                                {matchResult.matchScore}%
                            </p>

                        </div>


                        {/* MATCHING SKILLS */}

                        <div className="mb-6">

                            <h3 className="text-xl font-bold dark:text-white mb-3">
                                ✅ Matching Skills
                            </h3>

                            <div className="flex flex-wrap gap-2">

                                {matchResult.matchingSkills?.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-green-100 text-green-800 px-3 py-2 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>


                        {/* MISSING SKILLS */}

                        <div className="mb-6">

                            <h3 className="text-xl font-bold dark:text-white mb-3">
                                ⚠️ Missing Skills
                            </h3>

                            <div className="flex flex-wrap gap-2">

                                {matchResult.missingSkills?.map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-red-100 text-red-800 px-3 py-2 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>


                        {/* MISSING KEYWORDS */}

                        <div className="mb-6">

                            <h3 className="text-xl font-bold dark:text-white mb-3">
                                🔎 Missing Keywords
                            </h3>

                            <ul className="list-disc ml-6 dark:text-gray-200">

                                {matchResult.missingKeywords?.map(
                                    (keyword, index) => (
                                        <li key={index}>
                                            {keyword}
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>


                        {/* SUGGESTIONS */}

                        <div className="mb-6">

                            <h3 className="text-xl font-bold dark:text-white mb-3">
                                💡 Suggestions
                            </h3>

                            <ul className="list-disc ml-6 dark:text-gray-200">

                                {matchResult.suggestions?.map(
                                    (suggestion, index) => (
                                        <li
                                            key={index}
                                            className="mb-2"
                                        >
                                            {suggestion}
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>


                        {/* RECOMMENDATIONS */}

                        <div>

                            <h3 className="text-xl font-bold dark:text-white mb-3">
                                🚀 Recommendations
                            </h3>

                            <ul className="list-disc ml-6 dark:text-gray-200">

                                {matchResult.recommendations?.map(
                                    (recommendation, index) => (
                                        <li
                                            key={index}
                                            className="mb-2"
                                        >
                                            {recommendation}
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>

                    </div>
                )}


                {/* ========================= */}
                {/* EXISTING JOB MATCHES */}
                {/* ========================= */}

                {jobs.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-2xl">

                            <h2 className="text-gray-500 dark:text-gray-300">
                                Total Matches
                            </h2>

                            <p className="text-4xl font-bold mt-3 dark:text-white">
                                {jobs.length}
                            </p>

                        </div>


                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-2xl">

                            <h2 className="text-gray-500 dark:text-gray-300">
                                Best Match
                            </h2>

                            <p className="text-4xl font-bold text-green-600 mt-3">
                                {jobs[0].matchPercentage}%
                            </p>

                        </div>


                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-2xl">

                            <h2 className="text-gray-500 dark:text-gray-300">
                                Top Company
                            </h2>

                            <p className="text-2xl font-bold mt-3 dark:text-white">
                                {jobs[0].company}
                            </p>

                        </div>

                    </div>
                )}


                {/* ========================= */}
                {/* JOB LIST */}
                {/* ========================= */}

                {jobs.length === 0 ? (

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">

                        <h2 className="text-2xl font-bold dark:text-white">
                            No Matching Jobs Found
                        </h2>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {jobs.map((job, index) => (

                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-2xl"
                            >

                                <div className="flex justify-between items-start">

                                    <div>

                                        <h2 className="text-2xl font-bold dark:text-white">
                                            {job.title}
                                        </h2>

                                        <p className="text-gray-500 mt-2">
                                            {job.company}
                                        </p>

                                        <p className="text-gray-500">
                                            {job.location}
                                        </p>

                                    </div>

                                    {index === 0 && (
                                        <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                                            🏆 Best Match
                                        </span>
                                    )}

                                </div>


                                <div className="mt-6">

                                    <div className="flex justify-between mb-2">

                                        <span className="font-medium dark:text-white">
                                            Match Percentage
                                        </span>

                                        <span className="font-bold dark:text-white">
                                            {job.matchPercentage}%
                                        </span>

                                    </div>


                                    <div className="w-full bg-gray-200 rounded-full h-4">

                                        <div
                                            className={`h-4 rounded-full ${
                                                job.matchPercentage >= 80
                                                    ? "bg-green-500"
                                                    : job.matchPercentage >= 60
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }`}
                                            style={{
                                                width: `${job.matchPercentage}%`,
                                            }}
                                        ></div>

                                    </div>

                                </div>


                                <div className="mt-6">

                                    <h3 className="text-lg font-bold mb-3 dark:text-white">
                                        AI Recommendation
                                    </h3>

                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 whitespace-pre-wrap dark:text-white">
                                        {job.reason}
                                    </div>

                                </div>


                                <div className="mt-6 flex gap-4">

                                    <button
                                        onClick={() => applyJob(job)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                                    >
                                        Apply Now
                                    </button>

                                    <button
                                        onClick={() => saveJob(job)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                                    >
                                        Save Job
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </Layout>
    );
}

export default JobMatches;