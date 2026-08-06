import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchApplications();

    }, []);

    const fetchApplications = async () => {

        try {

            const res = await API.get("/application/my");

            setApplications(res.data.applications);

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to Load Applications"

            );

        }

        finally {

            setLoading(false);

        }

    };

    const deleteApplication = async (id) => {

        if (!window.confirm("Delete this application?")) {

            return;

        }

        try {

            await API.delete(`/application/${id}`);

            toast.success("Application Deleted");

            fetchApplications();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to Delete"

            );

        }

    };

    if (loading) {

        return (

            <Layout>

                <div className="flex justify-center items-center h-[70vh] text-2xl font-bold">

                    Loading Applications...

                </div>

            </Layout>

        );

    }

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-4xl font-bold">

                        My Applications

                    </h1>

                    <span className="bg-blue-600 text-white px-5 py-2 rounded-lg">

                        {applications.length} Applications

                    </span>

                </div>

                {

                    applications.length === 0 ?

                    (

                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">

                            <h2 className="text-2xl font-bold">

                                No Applications Yet

                            </h2>

                            <p className="text-gray-500 mt-3">

                                Apply to jobs from the AI Job Matches page.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="space-y-6">

                            {

                                applications.map((application) => (

                                    <div

                                        key={application._id}

                                        className="bg-white rounded-xl shadow-lg p-6"

                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h2 className="text-2xl font-bold">

                                                    {application.position}

                                                </h2>

                                                <p className="text-gray-600 mt-2">

                                                    {application.company}

                                                </p>

                                                <p className="text-gray-500">

                                                    {application.location}

                                                </p>

                                                <p className="mt-2">

                                                    <strong>Salary:</strong>{" "}

                                                    {application.salary}

                                                </p>

                                                <p>

                                                    <strong>Job Type:</strong>{" "}

                                                    {application.jobType}

                                                </p>

                                            </div>

                                            <span

                                                className={`px-4 py-2 rounded-full text-white font-bold ${

                                                    application.status === "Applied"

                                                        ? "bg-blue-600"

                                                        : application.status === "Interview"

                                                        ? "bg-yellow-500"

                                                        : application.status === "Rejected"

                                                        ? "bg-red-600"

                                                        : "bg-green-600"

                                                }`}

                                            >

                                                {application.status}

                                            </span>

                                        </div>

                                        <div className="mt-6">

                                            <p className="text-gray-500">

                                                Applied On

                                            </p>

                                            <p>

                                                {

                                                    new Date(

                                                        application.createdAt

                                                    ).toLocaleString()

                                                }

                                            </p>

                                        </div>

                                        <div className="mt-6">

                                            <button

                                                onClick={() =>

                                                    deleteApplication(

                                                        application._id

                                                    )

                                                }

                                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"

                                            >

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

        </Layout>

    );

}

export default MyApplications;