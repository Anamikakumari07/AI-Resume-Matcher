import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (

        <div className="bg-blue-700 text-white h-16 flex justify-between items-center px-8 shadow">

            <Link
                to="/dashboard"
                className="text-2xl font-bold"
            >

                AI Resume Matcher

            </Link>

            <button

                onClick={logout}

                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"

            >

                Logout

            </button>

        </div>

    );

}

export default Navbar;