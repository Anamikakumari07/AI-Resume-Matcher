import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeHistory from "./pages/ResumeHistory";
import JobMatches from "./pages/JobMatches";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MyApplications from "./pages/MyApplications";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/upload" element={<UploadResume />} />

            <Route path="/history" element={<ResumeHistory />} />

            <Route path="/jobs" element={<JobMatches />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/admin" element={<AdminDashboard />} />

            <Route
                path="/applications"
                element={<MyApplications />}
            />

        </Routes>

    );

}

export default App;