import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function MyApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [deletingApplication, setDeletingApplication] =
        useState(null);

    const hasFetched =
        useRef(false);


    // =====================================================
    // FETCH APPLICATIONS ONCE
    // =====================================================

    useEffect(() => {

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        fetchApplications();

    }, []);


    // =====================================================
    // FETCH APPLICATIONS
    // =====================================================

    const fetchApplications =
        async () => {

            try {

                setLoading(true);


                const res =
                    await API.get(
                        "/applications/my-applications"
                    );


                console.log(
                    "Applications Response:",
                    res.data
                );


                setApplications(
                    Array.isArray(
                        res.data?.applications
                    )
                        ? res.data.applications
                        : []
                );


            } catch (error) {

                console.log(
                    "Applications Error:",
                    error
                );


                toast.error(

                    error.response?.data?.message ||

                    "Unable to Load Applications"

                );


            } finally {

                setLoading(false);

            }

        };


    // =====================================================
    // DELETE APPLICATION
    // =====================================================

    const deleteApplication =
        async (id) => {

            if (
                !window.confirm(
                    "Delete this application?"
                )
            ) {

                return;

            }


            try {

                setDeletingApplication(
                    id
                );


                await API.delete(
                    `/applications/${id}`
                );


                setApplications(
                    (previous) =>
                        previous.filter(
                            (application) =>
                                application._id !==
                                id
                        )
                );


                toast.success(
                    "Application Deleted"
                );


            } catch (error) {

                console.log(
                    "Delete Application Error:",
                    error
                );


                toast.error(

                    error.response?.data?.message ||

                    "Unable to Delete"

                );


            } finally {

                setDeletingApplication(
                    null
                );

            }

        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="min-h-[60vh] flex items-center justify-center">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center w-full max-w-md">

                        <div className="text-5xl mb-4">
                            📤
                        </div>


                        <h2 className="text-xl font-semibold text-gray-700">
                            Loading applications...
                        </h2>


                        <p className="text-gray-500 mt-2">
                            Please wait while we fetch your applications.
                        </p>

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

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>

                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                            Career Tracker
                        </p>


                        <h1 className="text-4xl font-bold text-gray-800 mt-1">
                            My Applications
                        </h1>


                        <p className="text-gray-500 mt-2">
                            Track the jobs you have applied for.
                        </p>

                    </div>


                    <div className="bg-blue-600 text-white px-5 py-3 rounded-xl text-center">

                        <p className="text-xs opacity-80">
                            Total Applications
                        </p>


                        <p className="text-2xl font-bold">
                            {applications.length}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {applications.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                        <div className="text-6xl mb-5">
                            📭
                        </div>


                        <h2 className="text-2xl font-bold text-gray-800">
                            No Applications Yet
                        </h2>


                        <p className="text-gray-500 mt-3 max-w-md mx-auto">
                            Apply to jobs from the Job Matches page
                            and your applications will appear here.
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
                       APPLICATION LIST
                    ================================================= */

                    <div className="space-y-6">

                        {applications.map(
                            (application) => (

                                <div
                                    key={
                                        application._id
                                    }
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >

                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                                        <div>

                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {
                                                    application.position
                                                }
                                            </h2>


                                            <p className="text-blue-600 font-semibold mt-1">
                                                {
                                                    application.company
                                                }
                                            </p>


                                            {application.location && (

                                                <p className="text-gray-500 mt-2">
                                                    📍{" "}
                                                    {
                                                        application.location
                                                    }
                                                </p>

                                            )}

                                        </div>


                                        <span
                                            className={`px-4 py-2 rounded-full text-white font-semibold ${
                                                application.status ===
                                                "Applied"
                                                    ? "bg-blue-600"
                                                    : application.status ===
                                                      "Interview"
                                                    ? "bg-yellow-500"
                                                    : application.status ===
                                                      "Rejected"
                                                    ? "bg-red-600"
                                                    : "bg-green-600"
                                            }`}
                                        >

                                            {
                                                application.status ||
                                                "Applied"
                                            }

                                        </span>

                                    </div>


                                    {/* =================================================
                                        JOB INFO
                                    ================================================= */}

                                    <div className="grid sm:grid-cols-2 gap-4 mt-6">

                                        <div className="bg-gray-50 rounded-xl p-4">

                                            <p className="text-xs text-gray-400">
                                                Salary
                                            </p>


                                            <p className="font-semibold text-gray-700 mt-1">
                                                {
                                                    application.salary ||
                                                    "Not specified"
                                                }
                                            </p>

                                        </div>


                                        <div className="bg-gray-50 rounded-xl p-4">

                                            <p className="text-xs text-gray-400">
                                                Job Type
                                            </p>


                                            <p className="font-semibold text-gray-700 mt-1">
                                                {
                                                    application.jobType ||
                                                    "Not specified"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        APPLIED DATE
                                    ================================================= */}

                                    <div className="mt-6">

                                        <p className="text-xs text-gray-400">
                                            Applied On
                                        </p>


                                        <p className="text-gray-700 mt-1">

                                            {
                                                application.createdAt
                                                    ? new Date(
                                                        application.createdAt
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )
                                                    : "Recently"
                                            }

                                        </p>

                                    </div>


                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

                                    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100">

                                        {application.jobId && (

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/jobs/${application.jobId}`
                                                    )
                                                }
                                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                View Job
                                            </button>

                                        )}


                                        <button
                                            onClick={() =>
                                                deleteApplication(
                                                    application._id
                                                )
                                            }
                                            disabled={
                                                deletingApplication ===
                                                application._id
                                            }
                                            className={`px-5 py-2.5 rounded-lg border font-medium ${
                                                deletingApplication ===
                                                application._id
                                                    ? "bg-gray-100 text-gray-400 border-gray-200"
                                                    : "border-red-200 text-red-600 hover:bg-red-50"
                                            }`}
                                        >

                                            {
                                                deletingApplication ===
                                                application._id
                                                    ? "Deleting..."
                                                    : "🗑️ Delete"
                                            }

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </Layout>

    );

}

export default MyApplications;