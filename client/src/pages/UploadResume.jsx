import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function UploadResume() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async (e) => {

        e.preventDefault();

        if (!file) {
            toast.error("Please select a PDF file");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {

            setLoading(true);

            const res = await API.post(
                "/resume/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResult(res.data);

            toast.success("Resume Uploaded Successfully");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Upload Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 py-10">

            <div className="max-w-4xl mx-auto">

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-center mb-8">

                        Upload Resume

                    </h1>

                    <form
                        onSubmit={handleUpload}
                        className="space-y-5"
                    >

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                            className="w-full border p-3 rounded"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                        >

                            {loading
                                ? "Uploading..."
                                : "Upload Resume"}

                        </button>

                    </form>

                    {result && (

                        <div className="mt-10">

                            {/* ATS Score */}

                            <div className="bg-green-100 rounded-xl p-6 mb-6">

                                <h2 className="text-xl font-bold">

                                    ATS Score

                                </h2>

                                <p className="text-5xl font-bold text-green-700 mt-3">

                                    {result.atsScore}/100

                                </p>

                            </div>

                            {/* Resume Details */}

                            <div className="bg-white border rounded-xl p-5 mb-6">

                                <h2 className="text-xl font-bold mb-3">

                                    Resume Details

                                </h2>

                                <p>

                                    <strong>Filename:</strong>{" "}
                                    {result.resume.filename}

                                </p>

                                <p className="mt-2">

                                    <strong>Uploaded:</strong>{" "}

                                    {new Date(
                                        result.resume.uploadedAt
                                    ).toLocaleString()}

                                </p>

                            </div>

                            {/* AI Analysis */}

                            <div className="bg-white border rounded-xl p-5">

                                <h2 className="text-xl font-bold mb-4">

                                    AI Analysis

                                </h2>

                                <div className="whitespace-pre-wrap leading-8">

                                    {result.analysis}

                                </div>

                            </div>

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="mt-8 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                            >

                                Back to Dashboard

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default UploadResume;