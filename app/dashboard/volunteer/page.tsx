"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import EmergencyList from "../../../components/EmergencyList";
import { Role } from "@/lib/types";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: string;
  role: Role;
  name: string;
  email: string;
  [key: string]: any;
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

export default function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setVolunteer(data);
        } else {
          setVolunteer(null);
          toast.error("Failed to fetch profile. Please log in again.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setVolunteer(null);
        toast.error("An error occurred while fetching your profile.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch("/api/emergency");
      if (response.ok) {
        const data = await response.json();
        const emergenciesData = Array.isArray(data) ? data : [];
        console.log("Fetched emergencies:", emergenciesData); // Debug log
        setEmergencies(emergenciesData);
      } else {
        toast.error("Failed to fetch emergencies.");
        setEmergencies([]);
      }
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      toast.error("An error occurred while fetching emergencies.");
      setEmergencies([]);
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (emergencyId: string, volunteerName: string) => {
    console.log("Accepting emergency:", { emergencyId, volunteerName }); // Debug log
    try {
      const response = await fetch("/api/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyId, volunteer: volunteerName }),
      });

      const responseData = await response.json();
      console.log("POST /api/accept response:", {
        status: response.status,
        data: responseData,
      }); // Debug log

      if (response.ok) {
        setEmergencies((prev) =>
          Array.isArray(prev)
            ? prev.map((e) => (e.id === emergencyId ? responseData : e))
            : [responseData]
        );
      } else {
        toast.error(
          `Failed to accept emergency: ${responseData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error accepting emergency:", error);
      toast.error("An error occurred while accepting the emergency.");
    }
  };

  const handleDecline = async (emergencyId: string, volunteerName: string) => {
    console.log("Declining emergency:", { emergencyId, volunteerName }); // Debug log
    try {
      const response = await fetch("/api/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyId, volunteer: volunteerName }),
      });

      const responseData = await response.json();
      console.log("POST /api/decline response:", {
        status: response.status,
        data: responseData,
      }); // Debug log

      if (response.ok) {
        setEmergencies((prev) =>
          Array.isArray(prev)
            ? prev.map((e) => (e.id === emergencyId ? responseData : e))
            : [responseData]
        );
      } else {
        toast.error(
          `Failed to decline emergency: ${
            responseData.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error declining emergency:", error);
      toast.error("An error occurred while declining the emergency.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-inter">
      <section className="bg-gradient-to-r from-green-700 to-green-500 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Volunteer Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-green-100 mt-4 font-light"
          >
            View and accept emergencies to provide assistance.
          </motion.p>
        </div>
      </section>

      <div className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Emergencies
          </h2>
          {isLoading ? (
            <p className="text-gray-600">Loading emergencies...</p>
          ) : (
            <EmergencyList
              emergencies={emergencies}
              role="volunteer"
              onAccept={handleAccept}
              onDecline={handleDecline}
              volunteerName={volunteer?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
