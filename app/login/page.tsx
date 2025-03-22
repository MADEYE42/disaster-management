'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RoleForm from "@/components/RoleFormLogin";
import { Role } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface OnSubmitProps {
  endpoint: string;
  successMessage: string;
  buttonText: string;
  onSuccess: (data: {
    email: string;
    password: string;
    role: Role;
    token: string;
  }) => void;
  onError: (error: string) => void;
}

export default function Login() {
  const [role, setRole] = useState<Role>("user");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleLoginSuccess = (data: {
    email: string;
    password: string;
    role: Role;
    token: string;
  }) => {
    const { role, token } = data;
    setSuccess("Login successful! Redirecting...");
    // Store the token in local storage (optional, since the API sets an HTTP-only cookie)
    localStorage.setItem("token", token);
    console.log("handleLoginSuccess called with role:", role);
    console.log("Redirecting to:", `/dashboard/${role}`);
    router.push(`/dashboard/${role}`);
    // Fallback: If router.push doesn't work, use window.location
    setTimeout(() => {
      if (window.location.pathname === "/login") {
        console.log("Fallback redirect triggered");
        window.location.href = `/dashboard/${role}`;
      }
    }, 1000);
  };

  const onSubmit: OnSubmitProps = {
    endpoint: "/api/auth/login",
    successMessage: "Login successful! Redirecting...",
    buttonText: "Login",
    onSuccess: handleLoginSuccess,
    onError: (error: string) => {
      setError(error);
      toast.error(error);
    },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Promotional Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-green-800 to-green-600 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-green-900/30"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight animate-fade-in">
              Disaster Management App
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Sign in to stay prepared.
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Login is simple, free, and fast. One place to manage everything for
            disaster preparedness, response, and recovery.
          </p>
        </div>

        <div className="relative z-10 mt-8">
          <img
            src="https://images.pexels.com/photos/51951/forest-fire-fire-smoke-conservation-51951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
            alt="Medical team providing aid during a disaster"
          />
          <p className="text-sm text-gray-300 mt-4 text-center">
            Medical team providing aid during a disaster.
          </p>
        </div>

        <div className="relative z-10 mt-6">
          <p className="text-sm text-gray-300">
            Calculate the total impact of disaster management with us.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900">
              Welcome Back 👋
            </h3>
            <p className="mt-2 text-gray-600">
              Log in to manage your disaster preparedness.
            </p>
          </div>

          <div className="text-right">
            <Link
              href="/register"
              className="text-green-600 hover:text-green-500 font-medium transition-colors"
            >
              Don’t have an account? Register
            </Link>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white text-gray-900"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="volunteer">Volunteer</option>
              <option value="agency">Agency</option>
            </select>
          </div>

          <div className="mt-6">
            <RoleForm role={role} onSubmit={onSubmit} />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-600 mt-4"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-green-600 mt-4"
            >
              {success}
            </motion.div>
          )}

          <div className="text-center mt-4">
            <Link
              href="/forgot-password"
              className="text-green-600 hover:text-green-500 font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-700 transition-colors mx-2"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-700 transition-colors mx-2"
            >
              Terms and Conditions
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}