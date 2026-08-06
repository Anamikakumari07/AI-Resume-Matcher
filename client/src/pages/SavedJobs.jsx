import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function SavedJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        fetchSavedJobs();

    }, []);

    const fetchSavedJobs = async () => {

        try {

            const res = await API.get("/saved-jobs");

            setJobs(res.data.jobs);

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to Load Saved Jobs"

            );

        }

        finally {

            setLoading(false);

        }

    };

    const removeJob = async (id) => {

        try {

            await API.delete(`/saved-jobs/${id}`);

            toast.success("Job Removed");

            fetchSavedJobs();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to Remove"

            );

        }

    };

    const applyJob = async (job) => {

        try {

            await API.post("/application/apply", {

                company: job.company,

                position: job.title,

                location: job.location,

                salary: job.salary || "Not Disclosed",

                jobType: "Full Time",

            });

            toast.success("Application Submitted");

            navigate("/applications");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to Apply"

            );

        }

    };

    if (loading) {

        return (

            <Layout>

                <div className="flex justify-center items-center h-[70vh] text-2xl font-bold">

                    Loading Saved Jobs...

                </div>

            </Layout>

        );

    }

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-4xl font-bold">

                        Saved Jobs

                    </h1>

                    <span className="bg-purple-600 text-white px-5 py-2 rounded-lg">

                        {jobs.length} Saved

                    </span>

                </div>

                {

                    jobs.length === 0 ?

                    (

                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">

                            <h2 className="text-2xl font-bold">

                                No Saved Jobs

                            </h2>

                            <p className="text-gray-500 mt-3">

                                Save jobs from AI Job Matches.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="space-y-6">

                            {

                                jobs.map((job) => (

                                    <div

                                        key={job._id}

                                        className="bg-white rounded-xl shadow-lg p-6"

                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h2 className="text-2xl font-bold">

                                                    {job.title}

                                                </h2>

                                                <p className="text-gray-500 mt-2">

                                                    {job.company}

                                                </p>

                                                <p className="text-gray-500">

                                                    {job.location}

                                                </p>

                                            </div>

                                            <span className="bg-green-600 text-white px-4 py-2 rounded-full">

                                                {job.matchPercentage}%

                                            </span>

                                        </div>

                                        <div className="mt-6">

                                            <h3 className="font-bold mb-2">

                                                AI Recommendation

                                            </h3>

                                            <div className="bg-gray-100 rounded-lg p-4">

                                                {job.reason}

                                            </div>

                                        </div>

                                        <div className="mt-6 flex gap-4">

                                            <button

                                                onClick={() => applyJob(job)}

                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

                                            >

                                                Apply

                                            </button>

                                            <button

                                                onClick={() => removeJob(job._id)}

                                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"

                                            >

                                                Remove

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

export default SavedJobs;