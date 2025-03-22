"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaBars,
  FaTimes,
  FaUsers,
  FaBuilding,
  FaHandsHelping,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
import AdminTable from "../../../components/AdminTable";
import StateGraph from "../../../components/StateGraph";

interface User {
  email: string;
  id: string;
}

interface UsersData {
  users: User[];
  admins: User[];
  volunteers: User[];
  agencies: User[];
}

interface Emergency {
  id: string;
  title: string;
  description: string;
  user: string;
  status: string;
  volunteer: string | null;
  timestamp: string;
  state: string;
}

export default function AdminDashboard() {
  const [usersData, setUsersData] = useState<UsersData>({
    users: [],
    admins: [],
    volunteers: [],
    agencies: [],
  });
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await fetch("/api/users");
      const usersData = await usersResponse.json();
      setUsersData(usersData);

      const emergenciesResponse = await fetch("/api/emergencies");
      const emergenciesData = await emergenciesResponse.json();

      const states = ["California", "Texas", "Florida", "New York", "Illinois"];
      const emergenciesWithStates = emergenciesData.map(
        (emergency: Emergency, index: number) => ({
          ...emergency,
          state: states[index % states.length] || "",
        })
      );
      setEmergencies(emergenciesWithStates);
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-inter">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-green-700 to-green-500 text-white py-12 md:py-16 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 900 600"
            >
              <path
                fill="#ffffff"
                d="M0 0h150v150H0zM150 150h150v150H150zM300 300h150v150H300zM450 0h150v150H450zM600 150h150v150H600zM750 300h150v150H750zM0 450h150v150H0zM150 300h150v150H150zM300 150h150v150H300zM450 450h150v150H450zM600 300h150v150H600zM750 0h150v150H750z"
              />
            </svg>
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-green-800/20"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <button
              className="md:hidden absolute left-4 top-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars className="text-2xl text-white" />
            </button>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-green-100 mt-4 font-light"
            >
              Manage users, agencies, volunteers, and monitor emergency
              requests.
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid gap-8">
            <AdminTable title="Users" data={usersData.users} />
            <AdminTable title="Agencies" data={usersData.agencies} />
            <AdminTable title="Volunteers" data={usersData.volunteers} />
            <StateGraph emergencies={emergencies} />
          </div>
        </div>
      </div>
    </div>
  );
}
