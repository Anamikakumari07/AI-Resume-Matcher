import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({
    children,
    adminOnly = false,
}) {

    const location =
        useLocation();

    const {
        user,
        loading,
    } = useContext(
        AuthContext
    );


    // =====================================================
    // WAIT FOR AUTH CHECK
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-50">

                <div className="text-center">

                    <div className="text-4xl mb-3">
                        ⏳
                    </div>

                    <p className="text-gray-600 font-medium">
                        Checking authentication...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // NO USER / NO TOKEN
    // =====================================================

    if (
        !user ||
        !localStorage.getItem("token")
    ) {

        return (

            <Navigate
                to="/"
                replace
                state={{
                    from: location.pathname,
                }}
            />

        );

    }


    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (
        adminOnly &&
        String(
            user.role || ""
        ).toLowerCase() !== "admin"
    ) {

        return (

            <Navigate
                to="/dashboard"
                replace
            />

        );

    }


    return children;

}

export default ProtectedRoute;