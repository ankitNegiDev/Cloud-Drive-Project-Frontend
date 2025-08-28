// function VerifyEmail() {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen text-center">
//             <h2 className="text-2xl font-bold text-teal-400">Verify your email</h2>
//             <p className="mt-2 text-gray-400">
//                 We’ve sent you a verification link. Please check your inbox and confirm your account.
//             </p>
//         </div>
//     );
// }




import { useState, useEffect } from "react";
import { Mail } from "lucide-react";

function VerifyEmail() {
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    function handleResend() {
        setResending(true);
        setCountdown(3); // 3-second countdown for resending

        //TODO: we need to create a backend route for re-sending the email -- its optional -- later
        setTimeout(function () {
            setResending(false);
            setCountdown(0);
            alert("Verification email resent!");
        }, 3000);
    }

    function tick() {
        setCountdown(function (prev) {
            if (prev <= 1) return 0;
            return prev - 1;
        });
    }

    useEffect(function () {
        if (countdown > 0) {
            var timer = setTimeout(tick, 1000);
            return function () { clearTimeout(timer); };
        }
    }, [countdown]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl text-center animate-fade-in">
                {/* Envelope Icon */}
                <div className="flex items-center justify-center mb-6">
                    <Mail className="w-16 h-16 text-teal-400 animate-bounce" />
                </div>

                <h2 className="text-3xl font-bold text-teal-400 mb-4">
                    Verify Your Email
                </h2>
                <p className="text-gray-300 mb-6">
                    We have sent you a verification link. Please check your inbox and confirm your account.
                </p>

                {/* Resend Email Button */}
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-teal-400 text-gray-900 font-semibold rounded-xl hover:bg-teal-500 transition duration-300 disabled:opacity-50"
                >
                    {resending ? "Resending..." : "Resend Verification Email"}
                    {countdown > 0 ? ` (${countdown})` : ""}
                </button>

                {/* Go to Login Link */}
                <p className="mt-4 text-gray-400 text-sm">
                    Already verified?{" "}
                    <a href="/login" className="text-teal-400 hover:underline">
                        Go to Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default VerifyEmail;

