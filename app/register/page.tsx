'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RoleForm from "@/components/RoleForm";
import { Role } from "@/lib/types";

export default function Register() {
  const [role, setRole] = useState<Role>("user");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Define the onSubmit prop
  const onSubmitProp = {
    endpoint: "/api/auth/register",
    successMessage: "Registration successful! Redirecting to login...",
    buttonText: "Register",
    onSuccess: (data: {
      email: string;
      password: string;
      role: Role;
      name: string;
      phoneNumber: string;
      address: string;
      country: string;
      city: string;
      pinCode: string;
    }) => {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: string) => {
      setError(error);
    },
  };

  // Log the onSubmit prop to debug
  console.log("onSubmit prop in Register:", onSubmitProp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background with Mosaic Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>

      {/* Registration Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Select your role and register to get started.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
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
            <option value="volunteer">Volunteer</option>
            <option value="agency">Agency</option>
          </select>
        </div>

        {/* Role Form */}
        <div className="mt-6">
          <RoleForm role={role} onSubmit={onSubmitProp} />
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

        {/* Link to Login */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 hover:text-green-500 font-medium transition-colors"
            >
              Log in here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}