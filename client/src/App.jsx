import {
    lazy,
    Suspense
} from "react";

import {
    Routes,
    Route
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";


// =====================================================
// LAZY LOAD PAGES
// =====================================================

const Login =
    lazy(() =>
        import("./pages/Login")
    );


const Register =
    lazy(() =>
        import("./pages/Register")
    );


const Dashboard =
    lazy(() =>
        import("./pages/Dashboard")
    );


const UploadResume =
    lazy(() =>
        import("./pages/UploadResume")
    );


const ResumeHistory =
    lazy(() =>
        import("./pages/ResumeHistory")
    );


const JobMatches =
    lazy(() =>
        import("./pages/JobMatches")
    );


const JobDetails =
    lazy(() =>
        import("./pages/JobDetails")
    );


const SavedJobs =
    lazy(() =>
        import("./pages/SavedJobs")
    );


const MyApplications =
    lazy(() =>
        import("./pages/MyApplications")
    );


const Profile =
    lazy(() =>
        import("./pages/Profile")
    );


const AdminDashboard =
    lazy(() =>
        import("./pages/AdminDashboard")
    );


const NotFound =
    lazy(() =>
        import("./pages/NotFound")
    );


// =====================================================
// LOADING SCREEN
// =====================================================

function PageLoader() {

    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center w-full max-w-sm">

                <div className="text-5xl mb-4">
                    ⏳
                </div>


                <h2 className="text-xl font-semibold text-gray-800">
                    Loading page...
                </h2>


                <p className="text-gray-500 mt-2">
                    Please wait a moment.
                </p>

            </div>

        </div>

    );

}


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <ErrorBoundary>

            <Suspense
                fallback={
                    <PageLoader />
                }
            >

                <Routes>

                    {/* =========================================
                        PUBLIC ROUTES
                    ========================================= */}

                    <Route
                        path="/"
                        element={
                            <Login />
                        }
                    />


                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />


                    {/* =========================================
                        PROTECTED ROUTES
                    ========================================= */}

                    <Route
                        path="/dashboard"
                        element={

                            <ProtectedRoute>

                                <Dashboard />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/upload"
                        element={

                            <ProtectedRoute>

                                <UploadResume />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/history"
                        element={

                            <ProtectedRoute>

                                <ResumeHistory />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/jobs"
                        element={

                            <ProtectedRoute>

                                <JobMatches />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/jobs/:id"
                        element={

                            <ProtectedRoute>

                                <JobDetails />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/saved-jobs"
                        element={

                            <ProtectedRoute>

                                <SavedJobs />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/applications"
                        element={

                            <ProtectedRoute>

                                <MyApplications />

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/profile"
                        element={

                            <ProtectedRoute>

                                <Profile />

                            </ProtectedRoute>

                        }
                    />


                    {/* =========================================
                        ADMIN
                    ========================================= */}

                    <Route
                        path="/admin"
                        element={

                            <ProtectedRoute
                                adminOnly={true}
                            >

                                <AdminDashboard />

                            </ProtectedRoute>

                        }
                    />


                    {/* =========================================
                        404
                    ========================================= */}

                    <Route
                        path="*"
                        element={
                            <NotFound />
                        }
                    />

                </Routes>

            </Suspense>

        </ErrorBoundary>

    );

}


export default App;