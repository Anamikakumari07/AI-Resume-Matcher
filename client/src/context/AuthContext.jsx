import {
    createContext,
    useEffect,
    useState,
} from "react";

import API from "../services/api";


export const AuthContext =
    createContext();


function AuthProvider({
    children,
}) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // CHECK LOGIN
    // =====================================================

    useEffect(() => {

        checkUser();

    }, []);


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    const checkUser = async () => {

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            setUser(null);

            setLoading(false);

            return;

        }


        try {

            const res =
                await API.get(
                    "/auth/me"
                );


            setUser(
                res.data?.user ||
                null
            );


        } catch (error) {

            console.log(
                "Auth Check Error:",
                error
            );


            localStorage.removeItem(
                "token"
            );


            setUser(
                null
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const login = (
        token,
        userData
    ) => {

        localStorage.setItem(
            "token",
            token
        );


        setUser(
            userData ||
            null
        );

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );


        setUser(
            null
        );

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