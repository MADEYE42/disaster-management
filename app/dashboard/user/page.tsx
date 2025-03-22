"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import EmergencyForm from "../../../components/EmergencyForm";
import EmergencyList from "../../../components/EmergencyList";
import Chatbot from "../../../components/Chatbot";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Role } from "@/lib/types";

interface UserProfile {
  id: string;
  role: Role;
  name: string;
  email: string;
  [key: string]: any;
}

interface EmergencyFormProps {
  user: string;
  onSubmit: (emergency: {
    title: string;
    description: string;
    user: string;
  }) => void;
}

interface Emergency {
  id: string;
  title: string;
  description: string;
  user: string;
  status: string;
  volunteers: string[];
  timestamp: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
          toast.error("Failed to fetch profile. Please log in again.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
        toast.error("An error occurred while fetching your profile.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch("/api/emergency");
      if (response.ok) {
        const data = await response.json();
        setEmergencies(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to fetch emergencies.");
      }
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      toast.error("An error occurred while fetching emergencies.");
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePostEmergency = async (emergency: {
    title: string;
    description: string;
    user: string;
  }) => {
    try {
      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emergency),
      });

      const responseData = await response.json();
      console.log("POST /api/emergency response:", {
        status: response.status,
        data: responseData,
      });

      if (response.ok) {
        await fetchEmergencies();
        toast.success(
          "Your emergency has been posted and is awaiting volunteer acceptance."
        );
      } else {
        toast.error(
          `Failed to post emergency: ${responseData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error posting emergency:", error);
      toast.error("An error occurred while posting your emergency.");
    }
  };

  const userEmergencies = emergencies
    .filter((e) => e.user === user?.id)
    .map((e) => ({ ...e, status: e.status || "pending" }));

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-inter">
      <div className="flex-1 flex flex-col">
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
              Welcome, {user?.name || "User"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-green-100 mt-4 font-light"
            >
              Post and manage your emergencies with ease.
            </motion.p>
          </div>
        </section>

        <div className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-green-200/50"
          >
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              How It Works
            </h2>
            <p className="text-gray-600">
              Use the form below to post an emergency. Volunteers will be
              notified and can accept your request. Once accepted, our Mental
              Health Support AI will be available to assist you.
            </p>
          </motion.div>

          <div className="grid gap-8">
            {user && (
              <EmergencyForm user={user.id} onSubmit={handlePostEmergency} />
            )}
            {userEmergencies.length > 0 ? (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
                  Your Emergencies
                </h2>
                <EmergencyList emergencies={userEmergencies} role="user" />
              </div>
            ) : (
              <p className="text-gray-600">
                You have not posted any emergencies yet.
              </p>
            )}
          </div>
        </div>

        {userEmergencies.some((e) => e.status === "accepted") && <Chatbot />}
      </div>
    </div>
  );
}
