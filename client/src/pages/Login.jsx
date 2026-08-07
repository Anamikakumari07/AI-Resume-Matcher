import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({

        email: "",

        password: "",

    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await API.post(

                "/auth/login",

                formData

            );

            login(

                res.data.token,

                res.data.user

            );

            toast.success("Login Successful");

            navigate("/dashboard");

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-8">

                    Login

                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label className="block mb-2 font-semibold">

                            Email

                        </label>

                        <input

                            type="email"

                            name="email"

                            value={formData.email}

                            onChange={handleChange}

                            required

                            className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"

                        />

                    </div>

                    <div className="mb-6">

                        <label className="block mb-2 font-semibold">

                            Password

                        </label>

                        <input

                            type="password"

                            name="password"

                            value={formData.password}

                            onChange={handleChange}

                            required

                            className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"

                        />

                    </div>

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

                    >

                        {

                            loading

                                ? "Logging In..."

                                : "Login"

                        }

                    </button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?{" "}

                    <Link

                        to="/register"

                        className="text-blue-600 font-semibold"

                    >

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;