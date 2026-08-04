import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResumes: 0,
        averageATS: 0,
    });

    const [users, setUsers] = useState([]);

    const [resumes, setResumes] = useState([]);

    const [searchUser, setSearchUser] = useState("");

    const [searchResume, setSearchResume] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            const statsRes = await API.get("/admin/stats");

            const usersRes = await API.get("/admin/users");

            const resumesRes = await API.get("/admin/resumes");

            setStats(statsRes.data.stats);

            setUsers(usersRes.data.users);

            setResumes(resumesRes.data.resumes);

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load data"
            );

        }

    };

    const deleteUser = async (id) => {

        if (!window.confirm("Delete this user?"))
            return;

        try {

            await API.delete(`/admin/user/${id}`);

            toast.success("User Deleted");

            fetchData();

        }

        catch (error) {

            toast.error(error.response?.data?.message);

        }

    };

    const deleteResume = async (id) => {

        if (!window.confirm("Delete this resume?"))
            return;

        try {

            await API.delete(`/admin/resume/${id}`);

            toast.success("Resume Deleted");

            fetchData();

        }

        catch (error) {

            toast.error(error.response?.data?.message);

        }

    };

    const filteredUsers = useMemo(() => {

        return users.filter((user) =>
            user.name
                .toLowerCase()
                .includes(searchUser.toLowerCase())
        );

    }, [users, searchUser]);

    const filteredResumes = useMemo(() => {

        return resumes.filter((resume) =>
            resume.filename
                .toLowerCase()
                .includes(searchResume.toLowerCase())
        );

    }, [resumes, searchResume]);

    const barData = {

        labels: [
            "Users",
            "Resumes",
        ],

        datasets: [

            {

                label: "Platform Data",

                data: [

                    stats.totalUsers,

                    stats.totalResumes,

                ],

            },

        ],

    };

    const doughnutData = {

        labels: [
            "Average ATS",
            "Remaining",
        ],

        datasets: [

            {

                data: [

                    stats.averageATS,

                    100 - stats.averageATS,

                ],

            },

        ],

    };

    return (

        <div
            style={{
                padding: "30px",
            }}
        >

            <h1>

                Admin Dashboard

            </h1>

            <hr />

            <br />

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "40px",
                }}
            >

                <div>

                    <h2>

                        Total Users

                    </h2>

                    <h1>

                        {stats.totalUsers}

                    </h1>

                </div>

                <div>

                    <h2>

                        Total Resumes

                    </h2>

                    <h1>

                        {stats.totalResumes}

                    </h1>

                </div>

                <div>

                    <h2>

                        Average ATS

                    </h2>

                    <h1>

                        {stats.averageATS}

                    </h1>

                </div>

            </div>

            <div
                style={{
                    display: "flex",
                    gap: "50px",
                    marginBottom: "40px",
                }}
            >

                <div
                    style={{
                        width: "500px",
                    }}
                >

                    <Bar data={barData} />

                </div>

                <div
                    style={{
                        width: "300px",
                    }}
                >

                    <Doughnut
                        data={doughnutData}
                    />

                </div>

            </div>

            <hr />

            <h2>

                Users

            </h2>

            <input
                type="text"
                placeholder="Search User..."
                value={searchUser}
                onChange={(e) =>
                    setSearchUser(e.target.value)
                }
            />

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    marginTop: "20px",
                }}
            >

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredUsers.map((user) => (

                            <tr
                                key={user._id}
                            >

                                <td>

                                    {user.name}

                                </td>

                                <td>

                                    {user.email}

                                </td>

                                <td>

                                    {user.role}

                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            deleteUser(user._id)
                                        }
                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            <hr />

            <h2>

                Resume History

            </h2>

            <input
                type="text"
                placeholder="Search Resume..."
                value={searchResume}
                onChange={(e) =>
                    setSearchResume(e.target.value)
                }
            />

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    marginTop: "20px",
                }}
            >

                <thead>

                    <tr>

                        <th>

                            Filename

                        </th>

                        <th>

                            ATS

                        </th>

                        <th>

                            User

                        </th>

                        <th>

                            Delete

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredResumes.map((resume) => (

                            <tr
                                key={resume._id}
                            >

                                <td>

                                    {resume.filename}

                                </td>

                                <td>

                                    {resume.atsScore}

                                </td>

                                <td>

                                    {resume.user?.name}

                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            deleteResume(resume._id)
                                        }
                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default AdminDashboard;