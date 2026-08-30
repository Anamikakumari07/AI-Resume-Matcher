import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import ATSChart from "../components/ATSChart";

function Dashboard() {

    const [data, setData] = useState({
        resumes: [],
        readinessScore: 0,
        suggestions: [],
    });

    const [savedJobCount, setSavedJobCount] =
        useState(0);

    const [applicationCount, setApplicationCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [statsLoading, setStatsLoading] =
        useState(true);

    const hasFetched =
        useRef(false);


    // =====================================================
    // FETCH DASHBOARD DATA ONCE
    // =====================================================

    useEffect(() => {

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        fetchDashboard();

    }, []);


    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            setStatsLoading(true);


            // =================================================
            // RESUME DATA
            // =================================================

            const resumeResponse =
                await API.get(
                    "/resume/my-resumes"
                );


            console.log(
                "Dashboard Resume Response:",
                resumeResponse.data
            );


            setData({
                resumes:
                    Array.isArray(
                        resumeResponse.data?.resumes
                    )
                        ? resumeResponse.data.resumes
                        : [],

                readinessScore:
                    Number(
                        resumeResponse.data?.readinessScore
                    ) || 0,

                suggestions:
                    Array.isArray(
                        resumeResponse.data?.suggestions
                    )
                        ? resumeResponse.data.suggestions
                        : [],
            });


            // =================================================
            // SAVED JOBS
            // =================================================

            try {

                const savedResponse =
                    await API.get(
                        "/saved-jobs"
                    );


                console.log(
                    "Dashboard Saved Jobs Response:",
                    savedResponse.data
                );


                setSavedJobCount(
                    Number(
                        savedResponse.data?.count
                    ) ||
                    (
                        Array.isArray(
                            savedResponse.data?.savedJobs
                        )
                            ? savedResponse.data.savedJobs.length
                            : 0
                    )
                );


            } catch (savedError) {

                console.log(
                    "Dashboard Saved Jobs Error:",
                    savedError
                );

                setSavedJobCount(0);

            }


            // =================================================
            // APPLICATIONS
            // =================================================

            try {

                const applicationResponse =
    await API.get("/applications/stats");

console.log(
    "Dashboard Applications Response:",
    applicationResponse.data
);

setApplicationCount(
    Number(
        applicationResponse.data?.totalApplications
    ) || 0
);


                console.log(
                    "Dashboard Applications Response:",
                    applicationResponse.data
                );


                const applications =
                    applicationResponse.data?.applications;


                setApplicationCount(

                    Number(
                        applicationResponse.data?.count
                    ) ||

                    (
                        Array.isArray(
                            applications
                        )
                            ? applications.length
                            : 0
                    )

                );


            } catch (applicationError) {

                console.log(
                    "Dashboard Applications Error:",
                    applicationError
                );

                // If your application route is not available yet,
                // keep the Dashboard working instead of crashing.

                setApplicationCount(0);

            }


        } catch (error) {

            console.log(
                "Dashboard Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to load dashboard"
            );


        } finally {

            setLoading(false);

            setStatsLoading(false);

        }

    };


    // =====================================================
    // GET LATEST RESUME
    // =====================================================

    const latestResume =
        data.resumes.length > 0
            ? data.resumes[0]
            : null;


    // =====================================================
    // GET LATEST ATS SCORE
    // =====================================================

    const latestATSScore =
        latestResume
            ? Number(
                latestResume.atsScore
            ) || 0
            : 0;


    // =====================================================
    // RESUME STRENGTH
    // =====================================================

    const getStrength = () => {

        if (
            data.readinessScore >= 90
        ) {

            return "Excellent";

        }


        if (
            data.readinessScore >= 75
        ) {

            return "Good";

        }


        if (
            data.readinessScore >= 50
        ) {

            return "Average";

        }


        return "Needs Work";

    };


    // =====================================================
    // READINESS COLOR
    // =====================================================

    const getReadinessColor = () => {

        if (
            data.readinessScore >= 90
        ) {

            return "text-green-600";

        }


        if (
            data.readinessScore >= 75
        ) {

            return "text-blue-600";

        }


        if (
            data.readinessScore >= 50
        ) {

            return "text-yellow-600";

        }


        return "text-red-600";

    };


    // =====================================================
    // ATS COLOR
    // =====================================================

    const getATSColor = () => {

        if (
            latestATSScore >= 80
        ) {

            return "text-green-600";

        }


        if (
            latestATSScore >= 60
        ) {

            return "text-yellow-600";

        }


        if (
            latestATSScore > 0
        ) {

            return "text-red-600";

        }


        return "text-gray-400";

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                    <div className="text-5xl mb-4">
                        📊
                    </div>


                    <h2 className="text-xl font-semibold text-gray-700">
                        Loading your dashboard...
                    </h2>


                    <p className="text-gray-500 mt-2">
                        Fetching your resume and application statistics.
                    </p>

                </div>

            </Layout>

        );

    }


    return (

        <Layout>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Dashboard
                </h1>


                <p className="text-gray-500 mt-2">
                    Track your resume performance and interview readiness.
                </p>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">


                {/* =================================================
                    TOTAL RESUMES
                ================================================= */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Total Resumes
                            </p>


                            <h2 className="text-4xl font-bold text-gray-800 mt-2">

                                {data.resumes.length}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                            📄
                        </div>

                    </div>


                    <p className="text-sm text-gray-400 mt-4">
                        Resumes uploaded
                    </p>

                </div>


                {/* =================================================
                    LATEST ATS SCORE
                ================================================= */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Latest ATS Score
                            </p>


                            <h2
                                className={`text-4xl font-bold mt-2 ${getATSColor()}`}
                            >

                                {latestATSScore > 0
                                    ? `${latestATSScore}%`
                                    : "N/A"}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
                            📈
                        </div>

                    </div>


                    <p className="text-sm text-gray-400 mt-4">
                        Latest uploaded resume score
                    </p>

                </div>


                {/* =================================================
                    INTERVIEW READINESS
                ================================================= */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Interview Readiness
                            </p>


                            <h2
                                className={`text-4xl font-bold mt-2 ${getReadinessColor()}`}
                            >

                                {data.readinessScore}%

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                            🎯
                        </div>

                    </div>


                    <p className="text-sm text-gray-400 mt-4">
                        Overall readiness score
                    </p>

                </div>


                {/* =================================================
                    SAVED JOBS
                ================================================= */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Saved Jobs
                            </p>


                            <h2 className="text-4xl font-bold text-blue-600 mt-2">

                                {statsLoading
                                    ? "..."
                                    : savedJobCount}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                            🔖
                        </div>

                    </div>


                    <p className="text-sm text-gray-400 mt-4">
                        Jobs you saved
                    </p>

                </div>


                {/* =================================================
                    APPLICATIONS
                ================================================= */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Applications
                            </p>


                            <h2 className="text-4xl font-bold text-purple-600 mt-2">

                                {statsLoading
                                    ? "..."
                                    : applicationCount}

                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                            📤
                        </div>

                    </div>


                    <p className="text-sm text-gray-400 mt-4">
                        Applications submitted
                    </p>

                </div>


                {/* =================================================
                    RESUME STRENGTH
                ================================================= */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Resume Strength
                            </p>


                            <h2 className="text-2xl font-bold text-blue-600 mt-3">
                                {getStrength()}
                            </h2>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                            ⭐
                        </div>

                    </div>


                    <p className="text-sm text-gray-400 mt-4">
                        Based on your readiness score
                    </p>

                </div>

            </div>


            {/* =================================================
                ATS SCORE CHART
            ================================================= */}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            ATS Score History
                        </h2>


                        <p className="text-sm text-gray-500 mt-1">
                            Track how your resume score changes over time.
                        </p>

                    </div>


                    <div className="text-2xl">
                        📊
                    </div>

                </div>


                {data.resumes.length > 0 ? (

                    <ATSChart
                        resumes={
                            data.resumes
                        }
                    />

                ) : (

                    <div className="bg-gray-50 rounded-xl p-8 text-center">

                        <div className="text-4xl mb-3">
                            📊
                        </div>


                        <p className="text-gray-600">
                            Upload a resume to start tracking your ATS score.
                        </p>

                    </div>

                )}

            </div>


            {/* =================================================
                AI SUGGESTIONS
            ================================================= */}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">

                <div className="flex items-center gap-3 mb-6">

                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                        🤖
                    </div>


                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            AI Suggestions
                        </h2>


                        <p className="text-sm text-gray-500">
                            Improve your resume with AI-powered suggestions.
                        </p>

                    </div>

                </div>


                {data.suggestions.length === 0 ? (

                    <div className="bg-green-50 border border-green-100 rounded-xl p-5">

                        <p className="text-green-700 font-medium">
                            🎉 Excellent Resume!
                        </p>


                        <p className="text-sm text-green-600 mt-1">
                            No major improvements are currently required.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-3">

                        {data.suggestions.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={
                                        index
                                    }
                                    className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4"
                                >

                                    <span className="text-blue-600 font-bold">
                                        {index + 1}.
                                    </span>


                                    <p className="text-gray-700">
                                        {item}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


        </Layout>

    );

}

export default Dashboard;