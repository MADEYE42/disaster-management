"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import { FaChartBar } from "react-icons/fa";

interface StateGraphProps {
  emergencies: { state: string }[];
}

export default function StateGraph({ emergencies }: StateGraphProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const stateCounts = emergencies.reduce((acc: { [key: string]: number }, emergency) => {
      const state = emergency.state || "Unknown";
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(stateCounts);
    const data = Object.values(stateCounts);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Emergency Requests",
            data,
            backgroundColor: "rgba(34, 197, 94, 0.6)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Emergency Requests by State",
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#1f2937",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Requests",
            },
          },
          x: {
            title: {
              display: true,
              text: "State",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [emergencies]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50"
    >
      <h3 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
        <FaChartBar className="text-gray-600" />
        Emergency Requests by State
      </h3>
      <canvas ref={chartRef} />
    </motion.div>
  );
}