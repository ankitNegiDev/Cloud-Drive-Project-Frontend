// auth callback this is where user will come once he loged in successfully with google and then re-direct from here to dashboard bpage.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

export default function AuthCallback() {
    const navigate = useNavigate();
    // 5 sec countdown
    const [countdown, setCountdown] = useState(5); 
    // state for circular progress
    const [progress, setProgress] = useState(100); 

    useEffect(() => {
        async function handleAuth() {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.log("OAuth callback error:", error);
                navigate("/login");
            } else if (session?.user) {
                console.log("User logged in via Google:", session.user);

                const total = 5; // total seconds
                let current = total;

                function tick() {
                    setCountdown(current);
                    setProgress((current / total) * 100);

                    if (current <= 0) {
                        navigate("/dashboard");
                    } else {
                        current -= 1;
                        setTimeout(tick, 1000);
                    }
                }

                tick();
            }
        }

        handleAuth();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-teal-400 mb-6">
                    Logging in via Google...
                </h2>

                {/* Circular Progress */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                            className="text-gray-700"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="44"
                            cx="50%"
                            cy="50%"
                        />
                        <circle
                            className="text-teal-400 transition-all duration-1000 ease-linear"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="44"
                            cx="50%"
                            cy="50%"
                            strokeDasharray={2 * Math.PI * 44}
                            strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-teal-400">
                        {countdown}
                    </div>
                </div>

                <p className="text-gray-200 mb-2">
                    Redirecting to your dashboard in {countdown} second{countdown !== 1 ? "s" : ""}.
                </p>
            </div>
        </div>
    );
}
