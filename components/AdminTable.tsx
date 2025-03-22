"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaIdBadge, FaEye } from "react-icons/fa";

interface AdminTableProps {
  title: string;
  data: { email: string; id: string }[];
}

export default function AdminTable({ title, data }: AdminTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-6 border border-gray-100"
      role="region"
      aria-label={`${title} table`}
    >
      <h3 className="text-xl font-extrabold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 shadow-sm z-10">
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-700 font-semibold w-1/3">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-600" aria-hidden="true" />
                  <span className="sr-only">Email Icon</span>
                  Email
                </div>
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold w-1/3">
                <div className="flex items-center gap-2">
                  <FaIdBadge className="text-gray-600" aria-hidden="true" />
                  <span className="sr-only">ID Icon</span>
                  ID
                </div>
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold w-1/3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={index}
                className="border-b border-gray-100 transition-all duration-300 hover:bg-green-50"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <td className="py-3 px-4 text-gray-600 w-1/3">{item.email}</td>
                <td className="py-3 px-4 text-gray-600 w-1/3">{item.id}</td>
                <td className="py-3 px-4 w-1/3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-green-600 hover:text-green-800 transition-all duration-300"
                    aria-label={`View details for ${item.email}`}
                    onClick={() => alert(`Viewing details for ${item.email}`)} // Placeholder action
                  >
                    <FaEye className="text-lg" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}