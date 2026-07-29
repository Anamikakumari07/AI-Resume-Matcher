import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function ResumeHistory() {

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {

        try {

            const res = await API.get("/resume/my-resumes");

            setResumes(res.data.resumes);

        } catch (error) {

            console.log(error);

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

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

    };

    if (loading) {

        return (
            <div className="flex justify-center items-center h-screen text-2xl font-semibold">
                Loading...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-4xl font-bold mb-8">
                Resume History
            </h1>

            {resumes.length === 0 ? (

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <p className="text-xl">
                        No resumes uploaded yet.
                    </p>

                </div>

            ) : (

                <div className="space-y-6">

                    {resumes.map((resume) => (

                        <div
                            key={resume._id}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >

                            <div className="flex justify-between items-start">

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        {resume.filename}
                                    </h2>

                                    <p className="mt-3">
                                        <strong>ATS Score:</strong>{" "}
                                        <span className="text-green-600 font-bold">
                                            {resume.atsScore}/100
                                        </span>
                                    </p>

                                    <p className="mt-2">
                                        <strong>Uploaded:</strong>{" "}
                                        {new Date(
                                            resume.uploadedAt
                                        ).toLocaleString()}
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        handleDelete(resume._id)
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                            <div className="mt-6">

                                <h3 className="text-lg font-bold mb-3">
                                    AI Analysis
                                </h3>

                                <div className="bg-gray-100 rounded-lg p-4 whitespace-pre-wrap">

                                    {resume.analysis}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default ResumeHistory;