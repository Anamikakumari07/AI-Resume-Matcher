import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeHistory from "./pages/ResumeHistory";
import JobMatches from "./pages/JobMatches";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <Routes>

            {/* =========================================
                PUBLIC ROUTES
            ========================================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================================
                PROTECTED ROUTES
            ========================================= */}

            {/* Dashboard */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />


            {/* Upload Resume */}

            <Route
                path="/upload"
                element={
                    <ProtectedRoute>
                        <UploadResume />
                    </ProtectedRoute>
                }
            />


            {/* Resume History */}

            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <ResumeHistory />
                    </ProtectedRoute>
                }
            />


            {/* Job Matches */}

            <Route
                path="/jobs"
                element={
                    <ProtectedRoute>
                        <JobMatches />
                    </ProtectedRoute>
                }
            />


            {/* Job Details */}

            <Route
                path="/jobs/:id"
                element={
                    <ProtectedRoute>
                        <JobDetails />
                    </ProtectedRoute>
                }
            />


            {/* Saved Jobs */}

            <Route
                path="/saved-jobs"
                element={
                    <ProtectedRoute>
                        <SavedJobs />
                    </ProtectedRoute>
                }
            />


            {/* Applications */}

            <Route
                path="/applications"
                element={
                    <ProtectedRoute>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />


            {/* Profile */}

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />


            {/* Admin Dashboard */}

            <Route
    path="/admin"
    element={
        <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>


            {/* =========================================
                404
            ========================================= */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default App;