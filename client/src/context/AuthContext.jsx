import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        checkUser();

    }, []);

    const checkUser = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            setLoading(false);

            return;

        }

        try {

            const res = await API.get("/auth/me");

            setUser(res.data.user);

        }

        catch {

            localStorage.removeItem("token");

        }

        finally {

            setLoading(false);

        }

    };

    const login = (token, userData) => {

        localStorage.setItem("token", token);

        setUser(userData);

    };

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

                login,

                logout,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthProvider;