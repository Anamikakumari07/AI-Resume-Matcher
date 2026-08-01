import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Profile() {

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const res = await API.get("/auth/me");

            setUser(res.data.user);

            setFormData({
                name: res.data.user.name,
                email: res.data.user.email,
            });

        } catch (error) {

            toast.error("Failed to load profile");

        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.put(
                "/auth/update-profile",
                formData
            );

            setUser(res.data.user);

            toast.success("Profile Updated");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Update Failed"
            );

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        window.location.href = "/login";

    };

    if (!user) {

        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center">

            <div className="bg-white shadow-xl rounded-xl p-10 w-[550px]">

                <div className="flex justify-center">

                    <div className="w-28 h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold">

                        {formData.name.charAt(0).toUpperCase()}

                    </div>

                </div>

                <h1 className="text-3xl font-bold text-center mt-4">

                    Edit Profile

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        placeholder="Name"
                    />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        placeholder="Email"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                    >
                        Save Changes
                    </button>

                </form>

                <button
                    onClick={logout}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                >
                    Logout
                </button>

            </div>

        </div>

    );

}

export default Profile;