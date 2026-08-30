import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useContext,
} from "react";

import {
    AuthContext,
} from "../context/AuthContext";


function Navbar() {

    const navigate =
        useNavigate();


    const {
        user,
        logout,
    } = useContext(
        AuthContext
    );


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        logout();

        navigate(
            "/",
            {
                replace: true,
            }
        );

    };


    return (

        <div className="bg-blue-700 text-white min-h-16 flex flex-col sm:flex-row justify-between items-center gap-3 px-5 sm:px-8 py-3 shadow">

            <Link
                to="/dashboard"
                className="text-xl sm:text-2xl font-bold"
            >
                AI Resume Matcher
            </Link>


            <div className="flex items-center gap-4">

                {user?.name && (

                    <span className="hidden sm:block text-sm">

                        Hi,{" "}

                        <span className="font-semibold">
                            {user.name}
                        </span>

                    </span>

                )}


                <button
                    onClick={
                        handleLogout
                    }
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>

            </div>

        </div>

    );

}


export default Navbar;