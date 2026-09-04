import { Component } from "react";


class ErrorBoundary extends Component {

    constructor(props) {

        super(props);

        this.state = {
            hasError: false,
            error: null
        };

    }


    // =====================================================
    // CATCH RENDERING ERRORS
    // =====================================================

    static getDerivedStateFromError(error) {

        return {

            hasError: true,

            error

        };

    }


    // =====================================================
    // LOG ERROR
    // =====================================================

    componentDidCatch(
        error,
        errorInfo
    ) {

        console.error(
            "Frontend Error:",
            error
        );

        console.error(
            "Error Info:",
            errorInfo
        );

    }


    // =====================================================
    // RELOAD APPLICATION
    // =====================================================

    handleReload = () => {

        window.location.reload();

    };


    // =====================================================
    // RETURN TO HOME
    // =====================================================

    handleHome = () => {

        window.location.href = "/";

    };


    // =====================================================
    // RENDER
    // =====================================================

    render() {

        if (
            !this.state.hasError
        ) {

            return this.props.children;

        }


        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 text-center max-w-lg w-full">

                    <div className="text-6xl mb-5">
                        ⚠️
                    </div>


                    <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                        Something went wrong
                    </p>


                    <h1 className="text-3xl font-bold text-gray-800 mt-2">
                        We couldn't load this page
                    </h1>


                    <p className="text-gray-500 mt-3 leading-relaxed">
                        An unexpected error occurred in the application.
                        Please try reloading the page.
                    </p>


                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">

                        <button
                            onClick={
                                this.handleReload
                            }
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            🔄 Reload Page
                        </button>


                        <button
                            onClick={
                                this.handleHome
                            }
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                        >
                            🏠 Go Home
                        </button>

                    </div>

                </div>

            </div>

        );

    }

}


export default ErrorBoundary;