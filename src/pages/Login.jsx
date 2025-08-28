
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

function Login() {
    // Destructure or getting both login and googleLogin from AuthContext -- 
    const { login, googleLogin } = useContext(AuthContext);

    // a state for formdata since -- we will send this data to backend and it will contain all those data which we are collecting from user by using form.
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    // handle input changes
    /**
     * here we had single handelr for email change and pasword change from the input -- means this isngle handelr is getting the email and passwrod from input field whee user will wirte -- and it works fine because each input has a name attribute and its value so  here we first getting the name and value from the event.target (which trigger this event) and then adding it in form data or Update formData state by copying the previous values (`...prev`) and setting the new value for the corresponding key (`[name]: value`). either email or password.
     */
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(function (prev) {
            return { ...prev, [name]: value };
        });
    }

    // handle email/password login -- this will handel form submit when user click sign in /login button..
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    // handle Google login
    async function handleGoogleLogin() {
        setGoogleLoading(true);

        try {
            await googleLogin();
            toast.success("Google login successful!");
            navigate("/auth-callback");
        } catch (error) {
            console.error("Google login error:", error);
            toast.error(error.message || "Google login failed");
        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-teal-400">
                    Login
                </h2>

                {/* Email/Password Login */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-teal-400 text-gray-900 font-medium rounded-lg hover:bg-teal-500 transition disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-600"></div>
                    <span className="px-3 text-gray-400 text-sm">or</span>
                    <div className="flex-grow h-px bg-gray-600"></div>
                </div>

                {/* Google Login Button */}
                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full py-2 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition disabled:opacity-50 shadow-md"
                >
                    {/* Optional: Google icon */}
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 533.5 544.3"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M533.5 278.4c0-17.7-1.6-34.7-4.6-51.1H272v96.8h146.9c-6.3 33.8-25 62.4-53.2 81.5v67h85.8c50.2-46.3 79-114.2 79-194.2z"
                            fill="#4285F4"
                        />
                        <path
                            d="M272 544.3c72.8 0 134-24.1 178.7-65.4l-85.8-67c-23.8 15.9-54.2 25.3-92.9 25.3-71.6 0-132.3-48.2-154.1-112.7H28.2v70.9C72.8 481.4 166 544.3 272 544.3z"
                            fill="#34A853"
                        />
                        <path
                            d="M117.9 322.4c-10.3-30.7-10.3-63.9 0-94.6v-70.9H28.2c-39.8 79.9-39.8 175.5 0 255.4l89.7-70.9z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M272 107.7c39.6 0 75.3 13.6 103.4 40.4l77.7-77.7C404.6 24.5 343.3 0 272 0 166 0 72.8 62.9 28.2 155.7l89.7 70.9C139.7 156 200.4 107.7 272 107.7z"
                            fill="#EA4335"
                        />
                    </svg>

                    <span>{googleLoading ? "Connecting..." : "Sign in with Google"}</span>
                </button>


                <p className="mt-4 text-gray-400 text-sm text-center">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-teal-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;

