"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCloudRain, FaExclamationTriangle, FaUndo, FaTree, FaBuilding, FaMountain, FaLandmark, FaSun, FaArrowLeft } from "react-icons/fa";
import { CiWheat } from "react-icons/ci";
import {
  FiDroplet, FiMap, FiAnchor, FiGlobe, FiShield, FiLayers,
  FiAlertTriangle, FiZap, FiDroplet as FiDrainage, FiWind,
  FiMapPin, FiTool, FiUsers, FiClipboard, FiBriefcase
} from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Interface for form data
interface FormData {
  MonsoonIntensity: number;
  TopographyDrainage: number;
  RiverManagement: number;
  Deforestation: number;
  Urbanization: number;
  ClimateChange: number;
  DamsQuality: number;
  Siltation: number;
  AgriculturalPractices: number;
  Encroachments: number;
  IneffectiveDisasterPreparedness: number;
  DrainageSystems: number;
  CoastalVulnerability: number;
  Landslides: number;
  Watersheds: number;
  DeterioratingInfrastructure: number;
  PopulationScore: number;
  WetlandLoss: number;
  InadequatePlanning: number;
  PoliticalFactors: number;
}

// Map form fields to minimalist icons
const fieldIcons: { [key: string]: React.ReactNode } = {
  MonsoonIntensity: <FiDroplet />,
  TopographyDrainage: <FiMap />,
  RiverManagement: <FiAnchor />,
  Deforestation: <FaTree />,
  Urbanization: <FaBuilding />,
  ClimateChange: <FiGlobe />,
  DamsQuality: <FiShield />,
  Siltation: <FiLayers />,
  AgriculturalPractices: <CiWheat />,
  Encroachments: <FiAlertTriangle />,
  IneffectiveDisasterPreparedness: <FiZap />,
  DrainageSystems: <FiDrainage />,
  CoastalVulnerability: <FiWind />,
  Landslides: <FaMountain />,
  Watersheds: <FiMapPin />,
  DeterioratingInfrastructure: <FiTool />,
  PopulationScore: <FiUsers />,
  WetlandLoss: <FaLandmark />,
  InadequatePlanning: <FiClipboard />,
  PoliticalFactors: <FiBriefcase />,
};

export default function DisasterPrediction() {
  const [selectedPrediction, setSelectedPrediction] = useState<"flood" | "drought" | null>(null);
  const [formData, setFormData] = useState<FormData>({
    MonsoonIntensity: 1,
    TopographyDrainage: 1,
    RiverManagement: 1,
    Deforestation: 1,
    Urbanization: 1,
    ClimateChange: 1,
    DamsQuality: 1,
    Siltation: 1,
    AgriculturalPractices: 1,
    Encroachments: 1,
    IneffectiveDisasterPreparedness: 1,
    DrainageSystems: 1,
    CoastalVulnerability: 1,
    Landslides: 1,
    Watersheds: 1,
    DeterioratingInfrastructure: 1,
    PopulationScore: 1,
    WetlandLoss: 1,
    InadequatePlanning: 1,
    PoliticalFactors: 1,
  });
  const [prediction, setPrediction] = useState<number | null>(null); // Changed to number type
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData); // No need for predictionType yet
      const floodPrediction = response.data.prediction;
      // If drought is selected, invert the flood prediction as a placeholder
      const finalPrediction = selectedPrediction === "drought" ? 1 - floodPrediction : floodPrediction;
      setPrediction(finalPrediction);
    } catch (err) {
      setError("Error fetching prediction. Please try again later.");
      console.error("Error fetching prediction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      MonsoonIntensity: 1,
      TopographyDrainage: 1,
      RiverManagement: 1,
      Deforestation: 1,
      Urbanization: 1,
      ClimateChange: 1,
      DamsQuality: 1,
      Siltation: 1,
      AgriculturalPractices: 1,
      Encroachments: 1,
      IneffectiveDisasterPreparedness: 1,
      DrainageSystems: 1,
      CoastalVulnerability: 1,
      Landslides: 1,
      Watersheds: 1,
      DeterioratingInfrastructure: 1,
      PopulationScore: 1,
      WetlandLoss: 1,
      InadequatePlanning: 1,
      PoliticalFactors: 1,
    });
    setPrediction(null);
    setError(null);
  };

  const handleBack = () => {
    setSelectedPrediction(null);
    setPrediction(null);
    setError(null);
    handleReset();
  };

  // Pie chart data
  const pieChartData = prediction !== null
    ? {
        labels: ["Risk", "No Risk"],
        datasets: [
          {
            data: [prediction * 100, 100 - prediction * 100],
            backgroundColor: selectedPrediction === "flood" ? ["#34D399", "#E5E7EB"] : ["#FBBF24", "#E5E7EB"],
            borderWidth: 0,
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowBlur: 10,
          },
        ],
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen text-black bg-green-700">
      {selectedPrediction ? (
        <>
          {/* Header Section */}
          <section className="bg-gradient-to-r from-green-700 to-green-500 text-white py-12 md:py-16 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
              >
                {selectedPrediction === "flood" ? "Flood Prediction" : "Drought Prediction"}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-green-100 mt-4 font-light"
              >
                Assess {selectedPrediction} risk with precision and ease.
              </motion.p>
            </div>
          </section>

          {/* Main Content */}
          <div className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 bg-gradient-to-b from-gray-50 to-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-green-200/50 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={handleBack}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
                    aria-label="Go back"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaArrowLeft className="mr-2" />
                    Back
                  </motion.button>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {selectedPrediction === "flood" ? "Flood Prediction Form" : "Drought Prediction Form"}
                  </h2>
                </div>
                <motion.button
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
                  aria-label="Reset form"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUndo className="mr-2" />
                  Reset
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Object.keys(formData).map((key) => (
                  <motion.div
                    key={key}
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * Object.keys(formData).indexOf(key) }}
                  >
                    <label className="flex items-center font-medium text-gray-700 mb-2">
                      <motion.span
                        className="mr-2 text-green-600"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {fieldIcons[key]}
                      </motion.span>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key as keyof FormData]}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-gray-700 shadow-inner hover:shadow-md"
                      aria-label={key}
                    />
                  </motion.div>
                ))}
                <div className="col-span-full flex justify-center mt-4">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : selectedPrediction === "flood" ? (
                      <FaCloudRain className="mr-2" />
                    ) : (
                      <FaSun className="mr-2" />
                    )}
                    {isLoading ? "Predicting..." : `Predict ${selectedPrediction === "flood" ? "Flood" : "Drought"} Risk`}
                  </motion.button>
                </div>
              </form>

              {/* Prediction Result */}
              {prediction !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="mt-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-green-200/50 text-center"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    {selectedPrediction === "flood" ? "Flood Probability" : "Drought Probability"}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.div
                      className="w-40 h-40 relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Pie
                        data={pieChartData!}
                        options={{
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true },
                          },
                          maintainAspectRatio: false,
                        }}
                      />
                      <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
                    </motion.div>
                    <motion.p
                      className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {(prediction * 100).toFixed(2)}%
                    </motion.p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mt-8 p-6 bg-red-50/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-200/50 text-center"
                >
                  <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center justify-center">
                    <FaExclamationTriangle className="mr-2" />
                    Error
                  </h3>
                  <p className="text-red-600">{error}</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <p className="text-gray-300 text-sm sm:text-base">
                © 2025 Disaster Management App. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      ) : (
        <div
          className="min-h-screen bg-gradient-to-r from-green-700 to-green-500 relative overflow-hidden"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 900 600\"%3E%3Cpath fill=\"%23ffffff\" fill-opacity=\"0.1\" d=\"M0 0h150v150H0zM150 150h150v150H150zM300 300h150v150H300zM450 0h150v150H450zM600 150h150v150H600zM750 300h150v150H750zM0 450h150v150H0zM150 300h150v150H150zM300 150h150v150H300zM450 450h150v150H450zM600 300h150v150H600zM750 0h150v150H750z\"/%3E%3C/svg%3E')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex flex-col sm:flex-row h-screen">
            {/* Flood Prediction Section */}
            <motion.div
              className="flex-1 flex items-center justify-center text-white cursor-pointer relative overflow-hidden backdrop-blur-md bg-white/10 border border-white/20"
              onClick={() => setSelectedPrediction("flood")}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                >
                  <FaCloudRain className="text-7xl sm:text-8xl mb-4 mx-auto text-green-100" />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-green-50">Flood Prediction</h2>
                <p className="text-lg sm:text-xl mt-2 font-light text-green-100">
                  Assess flood risk in your area.
                </p>
              </div>
            </motion.div>

            {/* Drought Prediction Section */}
            <motion.div
              className="flex-1 flex items-center justify-center text-white cursor-pointer relative overflow-hidden backdrop-blur-md bg-white/10 border border-white/20"
              onClick={() => setSelectedPrediction("drought")}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                >
                  <FaSun className="text-7xl sm:text-8xl mb-4 mx-auto text-green-100" />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-green-50">Drought Prediction</h2>
                <p className="text-lg sm:text-xl mt-2 font-light text-green-100">
                  Assess drought risk in your area.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}