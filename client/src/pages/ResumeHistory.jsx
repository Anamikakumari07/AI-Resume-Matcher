import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import downloadReport from "../utils/downloadReport";

function ResumeHistory() {

    const [resumes, setResumes] = useState([]);
    const [filteredResumes, setFilteredResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchResumes();
    }, []);

    useEffect(() => {

        let filtered = resumes.filter((resume) =>
            resume.filename
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        if (filter === "70") {
            filtered = filtered.filter(
                (resume) => resume.atsScore >= 70
            );
        }

        if (filter === "80") {
            filtered = filtered.filter(
                (resume) => resume.atsScore >= 80
            );
        }

        if (filter === "90") {
            filtered = filtered.filter(
                (resume) => resume.atsScore >= 90
            );
        }

        setFilteredResumes(filtered);

    }, [search, filter, resumes]);

    const fetchResumes = async () => {

        try {

            const res = await API.get("/resume/my-resumes");

            setResumes(res.data.resumes);
            setFilteredResumes(res.data.resumes);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch resumes"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete(`/resume/${id}`);

            toast.success("Resume Deleted Successfully");

            fetchResumes();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

    };

    if (loading) {

        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">
                    Loading...
                </h1>
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-4xl font-bold mb-8">
                Resume History
            </h1>

            {/* Search */}

            <input
                type="text"
                placeholder="Search Resume..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                className="w-full p-3 rounded-lg border mb-5"
            />

            {/* Filter */}

            <select
                value={filter}
                onChange={(e) =>
                    setFilter(e.target.value)
                }
                className="w-full p-3 rounded-lg border mb-8"
            >

                <option value="all">
                    All ATS Scores
                </option>

                <option value="70">
                    ATS ≥ 70
                </option>

                <option value="80">
                    ATS ≥ 80
                </option>

                <option value="90">
                    ATS ≥ 90
                </option>

            </select>

            {filteredResumes.length === 0 ? (

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h2 className="text-center text-xl">
                        No Resume Found
                    </h2>

                </div>

            ) : (

                filteredResumes.map((resume) => (

                    <div
                        key={resume._id}
                        className="bg-white rounded-xl shadow-lg p-6 mb-6"
                    >

                        <div className="flex justify-between items-start">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {resume.filename}
                                </h2>

                                <p className="mt-3">

                                    ATS Score

                                    <span
                                        className={`ml-3 px-3 py-1 rounded-full text-white font-bold ${
                                            resume.atsScore >= 90
                                                ? "bg-green-600"
                                                : resume.atsScore >= 80
                                                ? "bg-blue-600"
                                                : resume.atsScore >= 70
                                                ? "bg-yellow-500"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {resume.atsScore}
                                    </span>

                                </p>

                                <p className="text-gray-500 mt-2">

                                    Uploaded:

                                    {" "}

                                    {resume.uploadedAt
                                        ? new Date(
                                              resume.uploadedAt
                                          ).toLocaleString()
                                        : "No Date"}

                                </p>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() =>
                                        downloadReport(resume)
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Download PDF
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(resume._id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                        <div className="mt-6 bg-gray-100 rounded-lg p-5">

                            <h3 className="text-xl font-bold mb-3">
                                AI Analysis
                            </h3>

                            <pre className="whitespace-pre-wrap text-sm">
                                {resume.analysis}
                            </pre>

                        </div>

                    </div>

                ))

            )}

        </div>

    );

}

export default ResumeHistory;