"use client";
import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

interface EmergencyFormProps {
  user: string;
  onSubmit: (emergency: { title: string; description: string; user: string }) => void;
}

export default function EmergencyForm({ user, onSubmit }: EmergencyFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title, description, user });
    setTitle("");
    setDescription("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-green-200/50"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaExclamationTriangle className="mr-2 text-red-600" />
        Post an Emergency
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-inner hover:shadow-md"
            placeholder="Enter emergency title"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-inner hover:shadow-md"
            placeholder="Describe the emergency"
            rows={4}
          />
        </div>
        <motion.button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Post Emergency
        </motion.button>
      </form>
    </motion.div>
  );
}