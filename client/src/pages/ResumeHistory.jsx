import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function ResumeHistory() {

    const [resumes, setResumes] = useState([]);

    useEffect(() => {

        fetchResumes();

    }, []);

    const fetchResumes = async () => {

        try {

            const res = await API.get("/resume/my-resumes");

            setResumes(res.data.resumes);

        }

        catch {

            toast.error("Unable to load resumes");

        }

    };

    const deleteResume = async (id) => {

        try {

            await API.delete(`/resume/${id}`);

            toast.success("Resume Deleted");

            fetchResumes();

        }

        catch {

            toast.error("Delete Failed");

        }

    };

    return (

        <Layout>

            <div>

                <h1 className="text-4xl font-bold mb-8">

                    Resume History

                </h1>

                {

                    resumes.map((resume)=>(

                        <div

                            key={resume._id}

                            className="bg-white shadow rounded-xl p-6 mb-5"

                        >

                            <h2 className="text-2xl font-bold">

                                {resume.filename}

                            </h2>

                            <p className="mt-2">

                                ATS Score :

                                <strong>

                                    {" "}

                                    {resume.atsScore}

                                </strong>

                            </p>

                            <p className="text-gray-500 mt-2">

                                {

                                    new Date(

                                        resume.uploadedAt

                                    ).toLocaleString()

                                }

                            </p>

                            <div className="flex gap-4 mt-6">

                                <a

                                    href={`https://ai-resume-matcher-1-7xds.onrender.com/uploads/${resume.resumeUrl}`}
                                    target="_blank"

                                    rel="noreferrer"

                                    className="bg-blue-600 text-white px-5 py-2 rounded"

                                >

                                    View Resume

                                </a>

                                <a

                                href={`https://ai-resume-matcher-1-7xds.onrender.com/uploads/${resume.resumeUrl}`}
                                    download

                                    className="bg-green-600 text-white px-5 py-2 rounded"

                                >

                                    Download

                                </a>

                                <button

                                    onClick={()=>

                                        deleteResume(resume._id)

                                    }

                                    className="bg-red-600 text-white px-5 py-2 rounded"

                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </Layout>

    );

}

export default ResumeHistory;