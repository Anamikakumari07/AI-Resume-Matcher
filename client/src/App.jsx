import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeHistory from "./pages/ResumeHistory";
import JobMatches from "./pages/JobMatches";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

    return (

        <Routes>

            {/* Authentication */}

            <Route

                path="/"

                element={<Login />}

            />

            <Route

                path="/register"

                element={<Register />}

            />

            {/* Dashboard */}

            <Route

                path="/dashboard"

                element={<Dashboard />}

            />

            {/* Resume */}

            <Route

                path="/upload"

                element={<UploadResume />}

            />

            <Route

                path="/history"

                element={<ResumeHistory />}

            />

            {/* AI Jobs */}

            <Route

                path="/jobs"

                element={<JobMatches />}

            />

            <Route

                path="/saved-jobs"

                element={<SavedJobs />}

            />

            {/* Applications */}

            <Route

                path="/applications"

                element={<MyApplications />}

            />

            {/* Profile */}

            <Route

                path="/profile"

                element={<Profile />}

            />

            {/* Admin */}

            <Route

                path="/admin"

                element={<AdminDashboard />}

            />

        </Routes>

    );

}

export default App;