import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import ATSChart from "../components/ATSChart";
import ThemeToggle from "../components/ThemeToggle";

function Dashboard() {

    const [stats, setStats] = useState({
        totalResumes: 0,
        averageATS: 0,
        totalMatches: 0,
        totalApplications: 0,
        latestResume: null,
    });

    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            // Resume Data
            const resumeRes = await API.get("/resume/my-resumes");
            const resumeList = resumeRes.data.resumes;

            setResumes(resumeList);

            let average = 0;

            if (resumeList.length > 0) {

                average =
                    resumeList.reduce(
                        (sum, item) => sum + item.atsScore,
                        0
                    ) / resumeList.length;

            }

            // Job Matches
            const jobRes = await API.get("/jobs/match");

            // Applications
            const applicationRes =
                await API.get("/application/stats");

            setStats({

                totalResumes: resumeList.length,

                averageATS: average.toFixed(1),

                totalMatches:
                    jobRes.data.bestMatches.length,

                totalApplications:
                    applicationRes.data.totalApplications,

                latestResume:
                    resumeList[0] || null,

            });

        }

        catch (error) {

            console.log(error);

            toast.error("Failed to load dashboard");

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">

                    Dashboard

                </h1>

                <ThemeToggle />

            </div>

            {/* Dashboard Cards */}

            <div className="grid md:grid-cols-4 gap-6">

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-gray-500">

                        Total Resumes

                    </h2>

                    <p className="text-5xl font-bold mt-3">

                        {stats.totalResumes}

                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-gray-500">

                        Average ATS

                    </h2>

                    <p className="text-5xl font-bold text-green-600 mt-3">

                        {stats.averageATS}

                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-gray-500">

                        Job Matches

                    </h2>

                    <p className="text-5xl font-bold text-blue-600 mt-3">

                        {stats.totalMatches}

                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-gray-500">

                        Applications

                    </h2>

                    <p className="text-5xl font-bold text-purple-600 mt-3">

                        {stats.totalApplications}

                    </p>

                </div>

            </div>

            {/* Quick Actions */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-4">

                        Quick Actions

                    </h2>

                    <div className="space-y-4">

                        <a

                            href="/upload"

                            className="block bg-blue-600 text-white text-center py-3 rounded-lg"

                        >

                            Upload Resume

                        </a>

                        <a

                            href="/jobs"

                            className="block bg-green-600 text-white text-center py-3 rounded-lg"

                        >

                            View AI Job Matches

                        </a>

                        <a

                            href="/applications"

                            className="block bg-purple-600 text-white text-center py-3 rounded-lg"

                        >

                            My Applications

                        </a>

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-4">

                        Progress

                    </h2>

                    <p className="mb-3">

                        Resumes Uploaded :
                        <strong> {stats.totalResumes}</strong>

                    </p>

                    <p className="mb-3">

                        Jobs Matched :
                        <strong> {stats.totalMatches}</strong>

                    </p>

                    <p className="mb-3">

                        Applications :
                        <strong> {stats.totalApplications}</strong>

                    </p>

                    <p>

                        Average ATS :
                        <strong> {stats.averageATS}</strong>

                    </p>

                </div>

            </div>

            {/* ATS Chart */}

            <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

                <h2 className="text-2xl font-bold mb-5">

                    ATS Score History

                </h2>

                {

                    resumes.length > 0 ?

                        <ATSChart resumes={resumes} />

                        :

                        <p>No Data Available</p>

                }

            </div>

            {/* Latest Resume */}

            {

                stats.latestResume && (

                    <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

                        <h2 className="text-2xl font-bold mb-5">

                            Latest Resume

                        </h2>

                        <p>

                            <strong>Filename:</strong>{" "}

                            {stats.latestResume.filename}

                        </p>

                        <p className="mt-2">

                            <strong>ATS Score:</strong>{" "}

                            {stats.latestResume.atsScore}/100

                        </p>

                        <p className="mt-2">

                            <strong>Uploaded:</strong>{" "}

                            {

                                new Date(
                                    stats.latestResume.uploadedAt
                                ).toLocaleString()

                            }

                        </p>

                    </div>

                )

            }

            {/* Recent Activity */}

            <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

                <h2 className="text-2xl font-bold mb-5">

                    Recent Activity

                </h2>

                {

                    resumes.length === 0 ?

                        (

                            <p>No Activity</p>

                        )

                        :

                        (

                            resumes.slice(0, 5).map((resume) => (

                                <div

                                    key={resume._id}

                                    className="border-b py-3"

                                >

                                    <p className="font-semibold">

                                        {resume.filename}

                                    </p>

                                    <p className="text-gray-500">

                                        ATS Score : {resume.atsScore}

                                    </p>

                                    <p className="text-gray-400 text-sm">

                                        {

                                            new Date(
                                                resume.uploadedAt
                                            ).toLocaleString()

                                        }

                                    </p>

                                </div>

                            ))

                        )

                }

            </div>

        </div>

    );

}

export default Dashboard;