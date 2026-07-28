import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="bg-blue-600 text-white p-5 flex justify-between items-center">

                <h1 className="text-2xl font-bold">
                    AI Resume Matcher
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

            <div className="max-w-6xl mx-auto py-10">

                <h2 className="text-3xl font-bold mb-8">
                    Welcome 👋
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div
                        onClick={() => navigate("/upload")}
                        className="bg-white shadow-lg rounded-xl p-8 cursor-pointer hover:shadow-2xl"
                    >
                        <h3 className="text-xl font-semibold">
                            📄 Upload Resume
                        </h3>

                        <p className="mt-3 text-gray-600">
                            Upload your latest resume for AI analysis.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/history")}
                        className="bg-white shadow-lg rounded-xl p-8 cursor-pointer hover:shadow-2xl"
                    >
                        <h3 className="text-xl font-semibold">
                            📂 Resume History
                        </h3>

                        <p className="mt-3 text-gray-600">
                            View all uploaded resumes.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/jobs")}
                        className="bg-white shadow-lg rounded-xl p-8 cursor-pointer hover:shadow-2xl"
                    >
                        <h3 className="text-xl font-semibold">
                            💼 Job Matches
                        </h3>

                        <p className="mt-3 text-gray-600">
                            View AI recommended jobs.
                        </p>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;