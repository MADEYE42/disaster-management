'use client';
import { FormEvent, useState } from 'react';
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Role } from "@/lib/types";

// Define the form data type
interface FormData {
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  country: string;
  city: string;
  pinCode: string;
}

interface OnSubmitProps {
  endpoint: string;
  successMessage: string;
  buttonText: string;
  onSuccess: (data: FormData & { role: Role }) => void;
  onError: (error: string) => void;
}

interface RoleFormProps {
  role: Role;
  onSubmit: OnSubmitProps; // onSubmit is required
}

// Validation regex (same as the API)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const pinCodeRegex = /^\d{5,6}$/;

export default function RoleForm({ role, onSubmit }: RoleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
    country: "",
    city: "",
    pinCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Log the onSubmit prop to debug
  console.log("onSubmit prop in RoleForm:", onSubmit);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      toast.error("Phone number must be in format: 123-456-7890");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (!passwordRegex.test(formData.password.trim())) {
      toast.error(
        "Password must be at least 8 characters long and include at least 1 number and 1 special character"
      );
      return false;
    }
    if (!formData.country.trim()) {
      toast.error("Country is required");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!formData.pinCode.trim()) {
      toast.error("Pin code is required");
      return false;
    }
    if (!pinCodeRegex.test(formData.pinCode.trim())) {
      toast.error("Pin code must be a 5 or 6 digit number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(onSubmit.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(onSubmit.successMessage);
        onSubmit.onSuccess({ role, ...formData });
      } else {
        const errorMessage =
          data.error || "Registration failed. Please try again.";
        toast.error(errorMessage);
        onSubmit.onError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        "An unexpected error occurred. Please try again later.";
      toast.error(errorMessage);
      onSubmit.onError(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fallback for buttonText
  const buttonText = onSubmit?.buttonText || "Submit";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your name"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="123-456-7890"
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
        />
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your address"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your email"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your password"
        />
      </div>

      {/* Country */}
      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700"
        >
          Country
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your country"
        />
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your city"
        />
      </div>

      {/* Pin Code */}
      <div>
        <label
          htmlFor="pinCode"
          className="block text-sm font-medium text-gray-700"
        >
          Pin Code
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          type="text"
          id="pinCode"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:opacity-50"
          placeholder="Enter your pin code"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className={`w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {isLoading ? "Registering..." : buttonText}
      </motion.button>
    </form>
  );
}