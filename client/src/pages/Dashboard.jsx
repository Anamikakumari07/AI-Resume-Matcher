import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

import ATSChart from "../components/ATSChart";
import ThemeToggle from "../components/ThemeToggle";
import Layout from "../components/Layout";

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

            const resumeRes = await API.get("/resume/my-resumes");

            const resumeList = resumeRes.data.resumes || [];

            setResumes(resumeList);

            let average = 0;

            if (resumeList.length > 0) {

                average =
                    resumeList.reduce(

                        (sum, resume) =>

                            sum + resume.atsScore,

                        0

                    ) / resumeList.length;

            }

            const jobRes = await API.get("/jobs/match");

            const applicationRes = await API.get("/application/stats");

            setStats({

                totalResumes: resumeList.length,

                averageATS: average.toFixed(1),

                totalMatches: jobRes.data.bestMatches.length,

                totalApplications:
                    applicationRes.data.totalApplications,

                latestResume:
                    resumeList[0] || null,

            });

        }

        catch (error) {

            console.log(error);

            toast.error("Failed to load Dashboard");

        }

    };

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-4xl font-bold">

                        Dashboard

                    </h1>

                    <ThemeToggle />

                </div>

                {/* Cards */}

                <div className="grid md:grid-cols-4 gap-6">

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <p className="text-gray-500">

                            Total Resumes

                        </p>

                        <h2 className="text-5xl font-bold mt-3">

                            {stats.totalResumes}

                        </h2>

                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <p className="text-gray-500">

                            Average ATS

                        </p>

                        <h2 className="text-5xl font-bold text-green-600 mt-3">

                            {stats.averageATS}

                        </h2>

                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <p className="text-gray-500">

                            Job Matches

                        </p>

                        <h2 className="text-5xl font-bold text-blue-600 mt-3">

                            {stats.totalMatches}

                        </h2>

                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <p className="text-gray-500">

                            Applications

                        </p>

                        <h2 className="text-5xl font-bold text-purple-600 mt-3">

                            {stats.totalApplications}

                        </h2>

                    </div>

                </div>

                {/* Quick Actions */}

                <div className="grid md:grid-cols-2 gap-6 mt-8">

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold mb-5">

                            Quick Actions

                        </h2>

                        <div className="space-y-4">

                            <Link

                                to="/upload"

                                className="block bg-blue-600 text-white text-center py-3 rounded-lg"

                            >

                                Upload Resume

                            </Link>

                            <Link

                                to="/jobs"

                                className="block bg-green-600 text-white text-center py-3 rounded-lg"

                            >

                                View AI Job Matches

                            </Link>

                            <Link

                                to="/applications"

                                className="block bg-purple-600 text-white text-center py-3 rounded-lg"

                            >

                                My Applications

                            </Link>

                        </div>

                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold mb-5">

                            Progress

                        </h2>

                        <p className="mb-3">

                            Total Resume :
                            <strong> {stats.totalResumes}</strong>

                        </p>

                        <p className="mb-3">

                            Average ATS :
                            <strong> {stats.averageATS}</strong>

                        </p>

                        <p className="mb-3">

                            Job Matches :
                            <strong> {stats.totalMatches}</strong>

                        </p>

                        <p>

                            Applications :
                            <strong> {stats.totalApplications}</strong>

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

                    stats.latestResume &&

                    (

                        <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

                            <h2 className="text-2xl font-bold mb-5">

                                Latest Resume

                            </h2>

                            <p>

                                <strong>File :</strong>

                                {" "}

                                {stats.latestResume.filename}

                            </p>

                            <p className="mt-2">

                                <strong>ATS :</strong>

                                {" "}

                                {stats.latestResume.atsScore}/100

                            </p>

                            <p className="mt-2">

                                <strong>Uploaded :</strong>

                                {" "}

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

                                <p>

                                    No Activity

                                </p>

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

                                        <p>

                                            ATS Score : {resume.atsScore}

                                        </p>

                                        <p className="text-gray-500 text-sm">

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

        </Layout>

    );

}

export default Dashboard;