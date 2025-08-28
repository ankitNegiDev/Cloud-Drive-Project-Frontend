import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Image } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance";
import AuthContext from "../context/AuthContext";

function Signup() {
    const { signup } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatarUrl: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // handel the full name
    function handleFullNameChange(e) {
        const value = e.target.value;
        setFormData(function (prev) {
            return { ...prev, fullName: value };
        });
        // it means -- whatever the previous value just add this fullName:value as key value pair in it.
    }

    // handeling the email
    function handleEmailChange(e) {
        const value = e.target.value;
        setFormData(function (prev) {
            return { ...prev, email: value };
        });
    }

    // handeling the password.
    function handlePasswordChange(e) {
        const value = e.target.value;
        setFormData(function (prev) {
            return { ...prev, password: value };
        });
    }

    // handeling the confirm password..
    function handleConfirmPasswordChange(e) {
        const value = e.target.value;
        setFormData(function (prev) {
            return { ...prev, confirmPassword: value };
        });
    }

    // handeling the avatar so this handler function is getting the avatar image -- then creating the a link and setting it in avatarPreview state. so that we ccan show which image is uploaded by user.
    function handleAvatarChange(e) {
        const files = e.target.files;
        if (files && files.length > 0) {
            setAvatarFile(files[0]);
            /**
             * URL.createObjectURL(files[0]) it creates a temporary URL that points to the selected file. and this is a browser-generated link that allows us to preview the image without even uplaoding uploading.
             */
            const previewUrl = URL.createObjectURL(files[0]);
            setAvatarPreview(previewUrl);
        }
    }

    // handeler that handel the avatar image upload.
    async function handleAvatarUpload() {
        if (!avatarFile) {
            toast.error("Please choose an avatar image first");
            return;
        }

        setUploading(true);

        try {
            const data = new FormData();
            data.append("avatar", avatarFile);

            // calling our api for uploading the avatar image.. here api is the axios instance.
            const res = await api.post("/auth", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Avatar upload response:", res);

            setFormData(function (prev) {
                return { ...prev, avatarUrl: res.data.path }; // adding the avatarUrl in formData
            });

            toast.success("Avatar uploaded!");
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    // handeler for signup
    async function handleSubmit(e) {
        e.preventDefault();

        // a simple check if password and confirm password did not matched.
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            // this signup function is coming from auth provider which is internally using the our auth service and which is in reality calling our  backend signup api
            const res = await signup(formData);

            toast.success("Signup successful!");
            console.log("Signup response:", res);

            // if singup is successfuly then user will move to email-verify page.
            navigate("/verify-email");
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-teal-400">
                    Create Account
                </h2>

                {/* Avatar Preview */}
                {avatarPreview && (
                    <div className="flex justify-center mt-4">
                        <img
                            src={avatarPreview}
                            alt="avatar preview"
                            className="w-20 h-20 rounded-full border-2 border-teal-400"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Full Name */}
                    <div className="relative">
                        <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleFullNameChange}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleEmailChange}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Image className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 text-gray-200"
                            />
                        </div>
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={handleAvatarUpload}
                            className="px-3 py-2 bg-teal-400 text-gray-900 font-medium rounded-lg hover:bg-teal-500 transition"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-teal-400 text-gray-900 font-medium rounded-lg hover:bg-teal-500 transition"
                    >
                        {loading ? "Signing up..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-4 text-gray-400 text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
