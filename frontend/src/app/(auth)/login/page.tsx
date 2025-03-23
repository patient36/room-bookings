"use client";
import { useState } from "react";
import ResetPassword from "@/components/ResetPassForm";
import LoginForm from "@/components/LoginForm";

const Login = () => {
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/dest1.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative backdrop-blur-md bg-white/20 dark:bg-gray-800/30 px-10 py-8 rounded-2xl shadow-2xl max-w-sm w-full">
                {isForgotPassword ? (
                    <ResetPassword setIsForgotPassword={setIsForgotPassword} />
                ) : (
                    <LoginForm setIsForgotPassword={setIsForgotPassword} />
                )}
            </div>
        </div>
    );
};

export default Login;