import { Link } from "react-router-dom";
import { Cloud, Moon, LogIn, User } from "lucide-react";

function Navbar() {
    return (
        <nav className="w-full h-[70px] shadow-sm bg-gray-900 rounded-2xl p-8">
            {/* Container to center content */}
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                {/* ---------- Left: Logo + Brand ---------- */}
                <div className="flex items-center gap-2">
                    <Cloud className="w-7 h-7 text-teal-400" />
                    <h1 className="text-xl font-bold text-teal-400">
                        CloudDrive
                    </h1>
                </div>

                {/* ---------- Center: Navigation Links ---------- */}
                <ul className="hidden md:flex items-center gap-8 font-medium text-gray-300 lg:text-lg">
                    <li>
                        <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
                    </li>
                    <li>
                        <Link to="/features" className="hover:text-teal-400 transition-colors">Features</Link>
                    </li>
                    <li>
                        <Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-teal-400 transition-colors">About</Link>
                    </li>
                </ul>

                {/* ---------- Right: Theme button, auth buttons & Profile ---------- */}
                <div className="flex items-center gap-4">
                    {/* Theme toggle (Moon icon placeholder) */}
                    <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <Moon className="w-5 h-5 text-gray-300" />
                    </button>

                    {/* Login button with icon */}
                    <Link
                        to="/login"
                        className="flex items-center gap-2 px-6 py-2 rounded-full bg-teal-400 text-gray-900 font-medium hover:bg-teal-500 transition-colors"
                    >
                        <LogIn className="w-5 h-5" />
                        Login
                    </Link>

                    {/* Profile avatar placeholder with User icon */}
                    <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                        <User className="w-5 h-5 text-gray-300" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
