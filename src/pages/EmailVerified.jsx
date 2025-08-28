
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerified() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [progress, setProgress] = useState(0);

    function tick() {
        setCountdown(function (prev) {
            if (prev <= 1) {
                navigate("/login");
                return 0;
            }
            return prev - 1;
        });
        setProgress(function (prev) {
            return Math.min(prev + 20, 100); 
        });
    }

    useEffect(function () {
        const timer = setInterval(tick, 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    }, [navigate]);

    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-teal-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-xl animate-pulse animation-delay-300"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse animation-delay-700"></div>
            </div>

            <div className="relative w-full max-w-lg bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl shadow-2xl text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
                {/* Success Icon with Animation */}
                <div className="mb-6 relative animate-in zoom-in duration-500 delay-300">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <svg
                            className="w-10 h-10 text-white animate-in fade-in duration-700 delay-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    {/* Ripple effects */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto bg-teal-400/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-20 h-20 mx-auto bg-teal-400/20 rounded-full animate-ping animation-delay-300"></div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-500">
                    Verification Successful!
                </h1>

                {/* Subtitle */}
                <p className="text-gray-300 text-lg mb-8 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-700">
                    Welcome aboard! Your email has been verified successfully.
                </p>

                {/* Progress Ring */}
                <div className="relative w-32 h-32 mx-auto mb-6 animate-in zoom-in duration-700 delay-1000">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-700"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#14b8a6" />
                                <stop offset="50%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Countdown number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white animate-pulse">
                            {countdown}
                        </span>
                    </div>
                </div>

                {/* Countdown text */}
                <p className="text-gray-400 mb-6 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-1000">
                    Redirecting to login in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>

                {/* Action buttons */}
                <div className="space-y-3 animate-in slide-in-from-bottom-2 fade-in duration-700 delay-1200">
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-teal-500/25"
                    >
                        Go to Login Now
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3 px-6 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300 border border-gray-600 hover:border-gray-500 transform hover:scale-[1.02] active:scale-95"
                    >
                        Go to Dashboard
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-teal-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-emerald-400 rounded-full animate-ping animation-delay-500"></div>
            </div>

        </div>
    );
}