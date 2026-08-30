import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

function Profile() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const hasFetched =
        useRef(false);


    // =====================================================
    // FETCH PROFILE ONCE
    // =====================================================

    useEffect(() => {

        if (hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        fetchProfile();

    }, []);


    // =====================================================
    // FETCH PROFILE
    // =====================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);


            const res =
                await API.get(
                    "/auth/me"
                );


            console.log(
                "Profile Response:",
                res.data
            );


            if (
                res.data?.user
            ) {

                setUser(
                    res.data.user
                );

            }


        } catch (error) {

            console.log(
                "Profile Error:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                "Unable to Load Profile"

            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (
        e
    ) => {

        const {
            name,
            value,
        } = e.target;


        setUser(
            (previous) => ({
                ...previous,

                [name]:
                    value,

            })
        );

    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const updateProfile =
        async (e) => {

            e.preventDefault();


            const name =
                user.name.trim();


            const email =
                user.email
                    .trim()
                    .toLowerCase();


            if (!name) {

                toast.error(
                    "Name cannot be empty."
                );

                return;

            }


            if (!email) {

                toast.error(
                    "Email cannot be empty."
                );

                return;

            }


            try {

                setSaving(true);


                const res =
                    await API.put(

                        "/auth/update-profile",

                        {
                            name,
                            email,
                        }

                    );


                console.log(
                    "Update Profile Response:",
                    res.data
                );


                if (
                    res.data?.user
                ) {

                    setUser(
                        res.data.user
                    );

                }


                toast.success(

                    res.data?.message ||

                    "Profile Updated"

                );


            } catch (error) {

                console.log(
                    "Update Profile Error:",
                    error
                );


                toast.error(

                    error.response?.data?.message ||

                    "Update Failed"

                );

            } finally {

                setSaving(false);

            }

        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout>

                <div className="min-h-[60vh] flex items-center justify-center">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center w-full max-w-md">

                        <div className="text-5xl mb-4">
                            👤
                        </div>


                        <h2 className="text-xl font-semibold text-gray-700">
                            Loading Profile...
                        </h2>


                        <p className="text-gray-500 mt-2">
                            Fetching your account information.
                        </p>

                    </div>

                </div>

            </Layout>

        );

    }


    return (

        <Layout>

            <div className="max-w-2xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6">

                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        Account
                    </p>


                    <h1 className="text-4xl font-bold text-gray-800 mt-1">
                        My Profile
                    </h1>


                    <p className="text-gray-500 mt-2">
                        Manage your personal account information.
                    </p>

                </div>


                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {/* =================================================
                        USER HEADER
                    ================================================= */}

                    <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">

                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                            👤
                        </div>


                        <div>

                            <h2 className="text-xl font-bold text-gray-800">
                                {user.name ||
                                    "User"}
                            </h2>


                            <p className="text-gray-500">
                                {user.email ||
                                    "No email"}
                            </p>


                            {user.role && (

                                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    {user.role}
                                </span>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            updateProfile
                        }
                    >

                        {/* NAME */}

                        <div className="mb-6">

                            <label
                                htmlFor="name"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Full Name
                            </label>


                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={
                                    user.name
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="mb-6">

                            <label
                                htmlFor="email"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Email
                            </label>


                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={
                                    user.email
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* ROLE */}

                        <div className="mb-6">

                            <label
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Account Role
                            </label>


                            <input
                                type="text"
                                value={
                                    user.role ||
                                    "User"
                                }
                                disabled
                                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl p-3 cursor-not-allowed"
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
                                saving
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >

                            {saving
                                ? "Saving Changes..."
                                : "Update Profile"}

                        </button>

                    </form>

                </div>

            </div>

        </Layout>

    );

}

export default Profile;