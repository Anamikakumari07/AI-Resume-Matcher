import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Redirect if already logged in
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }

    }, [navigate]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Login Failed"
            );

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white shadow-xl rounded-xl p-8 w-96">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-5">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-600 ml-2"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;