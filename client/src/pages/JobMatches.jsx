import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function JobMatches() {

    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {

        fetchJobs();

    }, []);

    useEffect(() => {

        filterJobs();

    }, [search, filter, jobs]);

    const fetchJobs = async () => {

        try {

            const res = await API.get("/jobs/match");

            setJobs(res.data.bestMatches);

            setFilteredJobs(res.data.bestMatches);

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load jobs"
            );

        }

        finally {

            setLoading(false);

        }

    };

    const filterJobs = () => {

        let data = [...jobs];

        if (search !== "") {

            data = data.filter((job) =>
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.company.toLowerCase().includes(search.toLowerCase())
            );

        }

        if (filter === "80+") {

            data = data.filter((job) => job.matchPercentage >= 80);

        }

        if (filter === "60+") {

            data = data.filter(

                (job) =>

                    job.matchPercentage >= 60 &&
                    job.matchPercentage < 80

            );

        }

        if (filter === "Below60") {

            data = data.filter(

                (job) =>

                    job.matchPercentage < 60

            );

        }

        setFilteredJobs(data);

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

    const saveJob = async (job) => {

        try {

            await API.post("/saved-jobs/save", {

                company: job.company,

                title: job.title,

                location: job.location,

                matchPercentage: job.matchPercentage,

                reason: job.reason,

            });

            toast.success("Job Saved");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to Save"

            );

        }

    };

    if (loading) {

        return (

            <div className="flex justify-center items-center h-screen text-2xl font-bold">

                Loading AI Job Matches...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">

                    AI Job Matches

                </h1>

                <button

                    onClick={() => navigate("/saved-jobs")}

                    className="bg-purple-600 text-white px-5 py-2 rounded"

                >

                    Saved Jobs

                </button>

            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">

                <input

                    type="text"

                    placeholder="Search Company or Job"

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    className="border p-3 rounded-lg"

                />

                <select

                    value={filter}

                    onChange={(e) => setFilter(e.target.value)}

                    className="border p-3 rounded-lg"

                >

                    <option value="All">

                        All Matches

                    </option>

                    <option value="80+">

                        80%+

                    </option>

                    <option value="60+">

                        60-79%

                    </option>

                    <option value="Below60">

                        Below 60%

                    </option>

                </select>

            </div>

            {

                filteredJobs.length === 0 ?

                    (

                        <div className="bg-white rounded-xl shadow-lg p-8">

                            No Matching Jobs

                        </div>

                    )

                    :

                    (

                        <div className="space-y-6">

                            {

                                filteredJobs.map((job, index) => (

                                    <div

                                        key={index}

                                        className="bg-white rounded-xl shadow-lg p-6"

                                    >

                                        <div className="flex justify-between">

                                            <div>

                                                <h2 className="text-2xl font-bold">

                                                    {job.title}

                                                </h2>

                                                <p>

                                                    {job.company}

                                                </p>

                                                <p>

                                                    {job.location}

                                                </p>

                                            </div>

                                            {

                                                index === 0 && (

                                                    <span className="bg-yellow-400 px-4 py-2 rounded-full">

                                                        🏆 Best Match

                                                    </span>

                                                )

                                            }

                                        </div>

                                        <div className="mt-5">

                                            <p>

                                                Match :

                                                <strong>

                                                    {" "}

                                                    {job.matchPercentage}%

                                                </strong>

                                            </p>

                                            <div className="w-full bg-gray-200 h-3 rounded mt-2">

                                                <div

                                                    className={`h-3 rounded ${
                                                        job.matchPercentage >= 80
                                                            ? "bg-green-500"
                                                            : job.matchPercentage >= 60
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}

                                                    style={{

                                                        width:

                                                            `${job.matchPercentage}%`

                                                    }}

                                                ></div>

                                            </div>

                                        </div>

                                        <div className="mt-5 bg-gray-100 p-4 rounded">

                                            {job.reason}

                                        </div>

                                        <div className="mt-6 flex gap-4">

                                            <button

                                                onClick={() => applyJob(job)}

                                                className="bg-blue-600 text-white px-6 py-2 rounded"

                                            >

                                                Apply

                                            </button>

                                            <button

                                                onClick={() => saveJob(job)}

                                                className="bg-pink-600 text-white px-6 py-2 rounded"

                                            >

                                                ❤️ Save

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