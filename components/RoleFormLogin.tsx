'use client';
import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Role } from '@/lib/types';

// Define the form data type
interface FormData {
  email: string;
  password: string;
}

interface OnSubmitProps {
  endpoint: string;
  successMessage: string;
  buttonText: string;
  onSuccess: (data: FormData & { role: Role; token: string }) => void;
  onError: (error: string) => void;
}

interface RoleFormProps {
  role: Role;
  onSubmit: OnSubmitProps;
}

// Validation regex (same as the API)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RoleForm({ role, onSubmit }: RoleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.password.trim()) {
      toast.error('Password is required');
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(onSubmit.successMessage);
        onSubmit.onSuccess({ role, ...formData, token: data.token });
      } else {
        const errorMessage = data.error || 'Login failed. Please try again.';
        toast.error(errorMessage);
        onSubmit.onError(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again later.';
      toast.error(errorMessage);
      onSubmit.onError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className={`w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
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
        {isLoading ? 'Logging in...' : onSubmit.buttonText}
      </motion.button>
    </form>
  );
}