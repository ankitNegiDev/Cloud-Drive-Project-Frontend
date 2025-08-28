import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { Cloud, Moon, LogIn, LayoutDashboard, User } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

function Navbar() {
    const { user } = useContext(AuthContext);
    console.log("user in navbar from auth context is : ",user);
    console.log("user from local storage is : ",localStorage.getItem("user"));
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Avatar URL (will be signed later)
    // const avatarUrl = null;

    // Get full name or fallback to email
    // const fullName = user?.response?.profile?.full_name || null;
    const fullName =
        user?.user_metadata?.full_name || // Google user
        user?.response?.profile?.full_name || // DB user
        user?.email?.split("@")[0] || null;   // fallback

    console.log("full name in navbar is : ",fullName);
    // const fullName="Ankit Negi";

    useEffect(() => {
        if (!user) return;

        // If Google login, get avatar from user_metadata
        if (user.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
            return;
        }

        // Otherwise, fetch avatar from backend (for email/password users)
        async function fetchAvatar() {
            try {
                const res = await api.get("/auth/avatar-signed-url");
                if (res.data.success && res.data.signedUrl) {
                    setAvatarUrl(res.data.signedUrl);
                }
            } catch (err) {
                console.error("Failed to fetch avatar signed URL:", err);
            }
        }

        fetchAvatar();
    }, [user]);

    // Generate first letter
    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

    // Generate a consistent random color per user (Google-like)
    const bgColor = useMemo(() => {
        if (!fullName) return "bg-gray-700";
        const colors = [
            "bg-red-900",
            "bg-blue-900",
            "bg-green-900",
            "bg-yellow-900",
            "bg-purple-900",
            "bg-pink-900",
            "bg-indigo-900",
            "bg-teal-900",
        ];
        let hash = 0;
        for (let i = 0; i < fullName.length; i++) {
            hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }, [fullName]);

    return (
        <nav className="w-full h-[70px] shadow-sm bg-gray-900 rounded-2xl p-8">
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
                        <Link to="/" className="hover:text-teal-400">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/features" className="hover:text-teal-400">
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link to="/pricing" className="hover:text-teal-400">
                            Pricing
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-teal-400">
                            About
                        </Link>
                    </li>
                </ul>

                {/* ---------- Right: Theme + Auth + Profile ---------- */}
                <div className="flex items-center gap-4">
                    {/* Theme toggle */}
                    <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
                    >
                        <Moon className="w-5 h-5 text-gray-300" />
                    </button>

                    {/* Auth button */}
                    {!user ? (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-teal-400 text-gray-900 font-medium hover:bg-teal-500"
                        >
                            <LogIn className="w-5 h-5" /> Login
                        </Link>
                    ) : (
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-teal-400 text-gray-900 font-medium hover:bg-teal-500"
                        >
                            <LayoutDashboard className="w-5 h-5" /> Dashboard
                        </Link>
                    )}

                    {/* Profile avatar */}
                    {user && (
                        <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 overflow-hidden ${avatarUrl ? "" : bgColor
                                }`}
                            onClick={() => navigate("/profile")}
                        >
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : fullName ? (
                                <span className="text-lg font-bold text-white">
                                    {getInitial(fullName)}
                                </span>
                            ) : (
                                        <User className="w-5 h-5 text-gray-300" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
