import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import ATSChart from "../components/ATSChart";

function Dashboard() {

    const [data, setData] = useState({

        resumes: [],

        readinessScore: 0,

        suggestions: [],

    });

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const res = await API.get(

                "/resume/my-resumes"

            );

            setData(res.data);

        }

        catch {

            toast.error("Unable to load dashboard");

        }

    };

    return (

        <Layout>

            <h1 className="text-4xl font-bold mb-8">

                Dashboard

            </h1>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white shadow rounded-xl p-6">

                    <h2>Total Resumes</h2>

                    <p className="text-5xl font-bold mt-3">

                        {data.resumes.length}

                    </p>

                </div>

                <div className="bg-white shadow rounded-xl p-6">

                    <h2>Interview Readiness</h2>

                    <p className="text-5xl font-bold text-green-600 mt-3">

                        {data.readinessScore}%

                    </p>

                </div>

                <div className="bg-white shadow rounded-xl p-6">

                    <h2>Resume Strength</h2>

                    <p className="text-5xl font-bold text-blue-600 mt-3">

                        {

                            data.readinessScore >= 90

                                ? "Excellent"

                                : data.readinessScore >= 75

                                ? "Good"

                                : "Needs Work"

                        }

                    </p>

                </div>

            </div>

            <div className="bg-white shadow rounded-xl p-6 mt-8">

                <h2 className="text-2xl font-bold mb-4">

                    ATS Score History

                </h2>

                <ATSChart

                    resumes={data.resumes}

                />

            </div>

            <div className="bg-white shadow rounded-xl p-6 mt-8">

                <h2 className="text-2xl font-bold mb-4">

                    AI Suggestions

                </h2>

                {

                    data.suggestions.length === 0

                    ?

                    <p>

                        Excellent Resume 🎉

                    </p>

                    :

                    <ul className="list-disc ml-6">

                        {

                            data.suggestions.map(

                                (item,index)=>(

                                    <li key={index}>

                                        {item}

                                    </li>

                                )

                            )

                        }

                    </ul>

                }

            </div>

        </Layout>

    );

}

export default Dashboard;