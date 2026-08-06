import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function Profile() {

    const [user, setUser] = useState({
        name: "",
        email: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const res = await API.get("/auth/me");

            setUser(res.data.user);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to Load Profile"

            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setUser({

            ...user,

            [e.target.name]: e.target.value,

        });

    };

    const updateProfile = async (e) => {

        e.preventDefault();

        try {

            const res = await API.put(

                "/auth/update-profile",

                {

                    name: user.name,

                    email: user.email,

                }

            );

            toast.success(

                res.data.message ||

                "Profile Updated"

            );

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Update Failed"

            );

        }

    };

    if (loading) {

        return (

            <Layout>

                <div className="flex justify-center items-center h-[70vh] text-2xl font-bold">

                    Loading Profile...

                </div>

            </Layout>

        );

    }

    return (

        <Layout>

            <div className="max-w-2xl mx-auto">

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-4xl font-bold mb-8">

                        My Profile

                    </h1>

                    <form onSubmit={updateProfile}>

                        <div className="mb-6">

                            <label className="block mb-2 font-semibold">

                                Full Name

                            </label>

                            <input

                                type="text"

                                name="name"

                                value={user.name}

                                onChange={handleChange}

                                className="w-full border rounded-lg p-3"

                            />

                        </div>

                        <div className="mb-6">

                            <label className="block mb-2 font-semibold">

                                Email

                            </label>

                            <input

                                type="email"

                                name="email"

                                value={user.email}

                                onChange={handleChange}

                                className="w-full border rounded-lg p-3"

                            />

                        </div>

                        <button

                            type="submit"

                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"

                        >

                            Update Profile

                        </button>

                    </form>

                </div>

            </div>

        </Layout>

    );

}

export default Profile;