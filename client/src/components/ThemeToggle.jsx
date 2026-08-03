import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {

    const { darkMode, toggleTheme } = useTheme();

    return (

        <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >

            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}

        </button>

    );

}

export default ThemeToggle;