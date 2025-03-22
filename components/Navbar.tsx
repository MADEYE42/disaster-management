'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, FileText, Users, LogOut, Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { Role } from "@/lib/types";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: string;
  role: Role;
  name: string;
  email: string;
  [key: string]: any;
}

export default function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch user profile on mount
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Log the response status and body for debugging
      const responseData = await res.json();
      console.log("Logout response:", {
        status: res.status,
        data: responseData,
      });

      if (res.ok) {
        setUser(null);
        toast.success("Logged out successfully.");
        router.push("/login");
        router.refresh();
      } else {
        toast.error(
          `Failed to log out: ${
            responseData.error || "Unknown error"
          } (Status: ${res.status})`
        );
      }
    } catch (error: any) {
      console.error("Logout error:", error.message, error.stack);
      toast.error(`An error occurred during logout: ${error.message}`);
    } finally {
      setIsOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-green-800/90 backdrop-blur-md text-white py-4 px-4 md:px-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 text-lg font-bold">M</span>
            </div>
            <span className="text-xl font-semibold">Disaster Management</span>
          </Link>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-yellow-500 transition-colors duration-200"
            >
              <Home size={20} /> Home
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-2 hover:text-yellow-500 transition-colors duration-200"
            >
              <FileText size={20} /> Guide
            </Link>
            <Link
              href="/emergency-contacts"
              className="flex items-center gap-2 hover:text-yellow-500 transition-colors duration-200"
            >
              <Users size={20} /> Emergency Contacts
            </Link>

            {/* Profile & Logout (Desktop) */}
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
                  {getInitials(user.name)}
                </div>
                <ProfileDropdown user={user} onLogout={handleLogout} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white hover:text-red-500 transition-colors duration-200"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-white hover:text-yellow-500 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu (Visible when toggled) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-green-800/95 backdrop-blur-2xl mt-4 rounded-lg p-4"
            >
              <nav
                className="flex flex-col space-y-4"
                role="navigation"
                aria-label="Mobile navigation"
              >
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700 hover:text-yellow-500 transition-colors duration-200"
                >
                  <Home size={20} /> Home
                </Link>
                <Link
                  href="/guide"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700 hover:text-yellow-500 transition-colors duration-200"
                >
                  <FileText size={20} /> Guide
                </Link>
                <Link
                  href="/emergency-contacts"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-700 hover:text-yellow-500 transition-colors duration-200"
                >
                  <Home size={20} /> Emergency Contacts
                </Link>

                {/* Profile & Logout (Mobile) */}
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                ) : user ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">
                      {getInitials(user.name)}
                    </div>
                    <ProfileDropdown user={user} onLogout={handleLogout} />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 p-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors duration-200"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}