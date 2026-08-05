import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function MyApplications() {

    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {

        try {

            const res = await API.get("/application/my-applications");

            setApplications(res.data.applications);

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load applications"
            );

        }

    };

    useEffect(() => {

        fetchApplications();

    }, []);

    const deleteApplication = async (id) => {

        if (!window.confirm("Withdraw this application?"))
            return;

        try {

            await API.delete(`/application/${id}`);

            toast.success("Application Withdrawn");

            fetchApplications();

        }

        catch (error) {

            toast.error(error.response?.data?.message);

        }

    };

    const getStatusColor = (status) => {

        switch (status) {

            case "Selected":
                return "bg-green-600";

            case "Interview":
                return "bg-blue-600";

            case "Rejected":
                return "bg-red-600";

            default:
                return "bg-yellow-500";

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">

                    My Applications

                </h1>

                <Link

                    to="/jobs"

                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"

                >

                    Apply More Jobs

                </Link>

            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 mb-8">

                <h2 className="text-xl font-semibold">

                    Total Applications

                </h2>

                <p className="text-5xl font-bold text-blue-600 mt-3">

                    {applications.length}

                </p>

            </div>

            {

                applications.length === 0 ?

                    (

                        <div className="bg-white rounded-xl shadow-lg p-10 text-center">

                            <h2 className="text-2xl font-bold">

                                No Applications Yet

                            </h2>

                            <p className="mt-3 text-gray-500">

                                Start applying to AI recommended jobs.

                            </p>

                            <Link

                                to="/jobs"

                                className="inline-block mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"

                            >

                                Browse Jobs

                            </Link>

                        </div>

                    )

                    :

                    (

                        <div className="grid md:grid-cols-2 gap-6">

                            {

                                applications.map((app) => (

                                    <div

                                        key={app._id}

                                        className="bg-white rounded-xl shadow-lg p-6"

                                    >

                                        <h2 className="text-2xl font-bold">

                                            {app.position}

                                        </h2>

                                        <p className="text-gray-600 mt-2">

                                            {app.company}

                                        </p>

                                        <p>

                                            📍 {app.location}

                                        </p>

                                        <p>

                                            💰 {app.salary}

                                        </p>

                                        <p>

                                            💼 {app.jobType}

                                        </p>

                                        <div className="mt-5">

                                            <span

                                                className={`${getStatusColor(app.status)} text-white px-4 py-2 rounded-full`}

                                            >

                                                {app.status}

                                            </span>

                                        </div>

                                        <button

                                            onClick={() => deleteApplication(app._id)}

                                            className="mt-6 bg-red-600 text-white px-5 py-2 rounded-lg"

                                        >

                                            Withdraw

                                        </button>

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </div>

    );

}

export default MyApplications;