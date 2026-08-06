import { NavLink } from "react-router-dom";

function Sidebar() {

    const linkClass = ({ isActive }) =>

        `block px-4 py-3 rounded-lg mb-3 font-medium ${
            isActive
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-200"
        }`;

    return (

        <div className="w-64 min-h-screen bg-gray-100 p-5 shadow">

            <h2 className="text-2xl font-bold mb-8">

                Dashboard

            </h2>

            <NavLink
                to="/dashboard"
                className={linkClass}
            >
                Dashboard
            </NavLink>

            <NavLink
                to="/upload"
                className={linkClass}
            >
                Upload Resume
            </NavLink>

            <NavLink
                to="/history"
                className={linkClass}
            >
                Resume History
            </NavLink>

            <NavLink
                to="/jobs"
                className={linkClass}
            >
                AI Job Matches
            </NavLink>

            <NavLink
                to="/saved-jobs"
                className={linkClass}
            >
                Saved Jobs
            </NavLink>

            <NavLink
                to="/applications"
                className={linkClass}
            >
                Applications
            </NavLink>

            <NavLink
                to="/profile"
                className={linkClass}
            >
                Profile
            </NavLink>

        </div>

    );

}

export default Sidebar;