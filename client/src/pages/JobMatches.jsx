import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function JobMatches() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        try {

            const res = await API.get("/jobs/match");

            setJobs(res.data.bestMatches);

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

    const applyJob = async (job) => {

        try {

            await API.post("/application/apply", {

                company: job.company,

                position: job.title,

                location: job.location,

                salary: job.salary || "Not Disclosed",

                jobType: "Full Time",

            });

            toast.success("Application Submitted Successfully");

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

            <div className="flex justify-center items-center h-screen text-2xl font-semibold">

                Loading AI Job Matches...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-4xl font-bold mb-8">

                AI Job Matches

            </h1>

            {

                jobs.length > 0 && (

                    <div className="grid md:grid-cols-3 gap-6 mb-8">

                        <div className="bg-white rounded-xl shadow-lg p-6">

                            <h2 className="text-gray-500">

                                Total Matches

                            </h2>

                            <p className="text-4xl font-bold mt-3">

                                {jobs.length}

                            </p>

                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">

                            <h2 className="text-gray-500">

                                Best Match

                            </h2>

                            <p className="text-4xl font-bold text-green-600 mt-3">

                                {jobs[0].matchPercentage}%

                            </p>

                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">

                            <h2 className="text-gray-500">

                                Top Company

                            </h2>

                            <p className="text-2xl font-bold mt-3">

                                {jobs[0].company}

                            </p>

                        </div>

                    </div>

                )

            }

            {

                jobs.length === 0 ?

                    (

                        <div className="bg-white rounded-xl shadow-lg p-8">

                            <p className="text-xl">

                                No matching jobs found.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="space-y-6">

                            {

                                jobs.map((job, index) => (

                                    <div

                                        key={index}

                                        className="bg-white rounded-xl shadow-lg p-6"

                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h2 className="text-2xl font-bold">

                                                    {job.title}

                                                </h2>

                                                <p className="text-gray-500 mt-1">

                                                    {job.company}

                                                </p>

                                                <p className="text-gray-500">

                                                    {job.location}

                                                </p>

                                            </div>

                                            {

                                                index === 0 && (

                                                    <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">

                                                        🏆 Best Match

                                                    </span>

                                                )

                                            }

                                        </div>

                                        <div className="mt-6">

                                            <div className="flex justify-between mb-2">

                                                <span className="font-medium">

                                                    Match Percentage

                                                </span>

                                                <span className="font-bold">

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

                                            <h3 className="text-lg font-bold mb-3">

                                                AI Recommendation

                                            </h3>

                                            <div className="bg-gray-100 rounded-lg p-4 whitespace-pre-wrap">

                                                {job.reason}

                                            </div>

                                        </div>

                                        <div className="mt-6 flex gap-4">

                                            <button

                                                onClick={() => applyJob(job)}

                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"

                                            >

                                                Apply Now

                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </div>

    );

}

export default JobMatches;