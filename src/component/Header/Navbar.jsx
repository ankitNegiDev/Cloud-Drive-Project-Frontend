

import { Link } from "react-router-dom";
import { Cloud, Moon, LogIn, User } from "lucide-react";

function Navbar() {
    return (
        <nav className="w-full h-[70px] shadow-sm bg-gray-200 rounded-2xl">
            {/* Container to center content */}
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                {/* ---------- Left: Logo + Brand ---------- */}
                <div className="flex items-center gap-2">
                    <Cloud className="w-7 h-7 text-blue-500" />
                    <h1 className="text-xl font-bold text-gray-800">
                        CloudDrive
                    </h1>
                </div>

                {/* ---------- Center: Navigation Links ---------- */}
                <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700 lg:text-lg">
                    <li>
                        <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
                    </li>
                    <li>
                        <Link to="/features" className="hover:text-blue-500 transition-colors">Features</Link>
                    </li>
                    <li>
                        <Link to="/pricing" className="hover:text-blue-500 transition-colors">Pricing</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-blue-500 transition-colors">About</Link>
                    </li>
                </ul>

                {/* ---------- Right: Theme button, auth buttons & Profile ---------- */}
                <div className="flex items-center gap-4">
                    {/* Theme toggle (Moon icon placeholder) */}
                    <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300 transition-colors"
                    >
                        <Moon className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Login button with icon */}
                    <Link
                        to="/login"
                        className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                    >
                        <LogIn className="w-5 h-5" />
                        Login
                    </Link>

                    {/* Profile avatar placeholder with User icon */}
                    <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                        <User className="w-5 h-5 text-gray-700" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
