"use client";
import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaFilter, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DisasterData {
  Year: string;
  Month: string;
  State: string;
  "Disaster Type": string;
  Probability: string;
  "Climate Zone": string;
  Season: string;
  Region: string;
}

const disasterColors: { [key: string]: string } = {
  Earthquake: "rgba(255, 99, 132, 0.6)",
  Storm: "rgba(54, 162, 235, 0.6)",
  Flood: "rgba(75, 192, 192, 0.6)",
  "Extreme temperature": "rgba(255, 159, 64, 0.6)",
  Epidemic: "rgba(153, 102, 255, 0.6)",
  "Mass movement (wet)": "rgba(255, 206, 86, 0.6)",
  Drought: "rgba(231, 233, 237, 0.6)",
  Default: "rgba(128, 128, 128, 0.6)",
};

const disasterBorderColors: { [key: string]: string } = {
  Earthquake: "rgba(255, 99, 132, 1)",
  Storm: "rgba(54, 162, 235, 1)",
  Flood: "rgba(75, 192, 192, 1)",
  "Extreme temperature": "rgba(255, 159, 64, 1)",
  Epidemic: "rgba(153, 102, 255, 1)",
  "Mass movement (wet)": "rgba(255, 206, 86, 1)",
  Drought: "rgba(231, 233, 237, 1)",
  Default: "rgba(128, 128, 128, 1)",
};

export default function AgencyDashboard() {
  const [data, setData] = useState<DisasterData[]>([]);
  const [filteredData, setFilteredData] = useState<DisasterData[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [disasterTypes, setDisasterTypes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedDisaster, setSelectedDisaster] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const itemsPerPage = 20;

  // Handle window resize and initialize windowWidth
  useEffect(() => {
    // Only execute this code in the browser
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial window width
    setWindowWidth(window.innerWidth);
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load and parse the CSV file
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    Papa.parse("/data/comprehensive_disaster_predictions_2025_2034.csv", {
      download: true,
      header: true,
      complete: (result: Papa.ParseResult<DisasterData>) => {
        const parsedData = result.data as DisasterData[];
        const cleanedData = parsedData.filter(
          (item) =>
            item.Probability &&
            typeof item.Probability === "string" &&
            item.Probability.trim() !== "" &&
            item.Probability.includes("%")
        );
        setData(cleanedData);
        setFilteredData(cleanedData);

        const uniqueYears = [
          ...Array.from(new Set(cleanedData.map((item) => item.Year))),
        ].sort();
        const uniqueDisasterTypes = [
          ...Array.from(
            new Set(cleanedData.map((item) => item["Disaster Type"]))
          ),
        ].sort();
        const uniqueRegions = [
          ...Array.from(new Set(cleanedData.map((item) => item.Region))),
        ].sort();
        setYears(["All", ...uniqueYears]);
        setDisasterTypes(["All", ...uniqueDisasterTypes]);
        setRegions(["All", ...uniqueRegions]);
        setIsLoading(false);
      },
      error: (error: unknown) => {
        console.error("Error parsing CSV:", error);
        setError("Failed to load disaster data. Please try again later.");
        setIsLoading(false);
      },
    });
  }, []);

  // Filter data based on selected year, disaster type, and region
  useEffect(() => {
    let filtered = [...data];

    if (selectedYear !== "All") {
      filtered = filtered.filter((item) => item.Year === selectedYear);
    }
    if (selectedDisaster !== "All") {
      filtered = filtered.filter(
        (item) => item["Disaster Type"] === selectedDisaster
      );
    }
    if (selectedRegion !== "All") {
      filtered = filtered.filter((item) => item.Region === selectedRegion);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [selectedYear, selectedDisaster, selectedRegion, data]);

  // Group data by state, taking the highest probability for each state
  const groupedData = useMemo(() => {
    const grouped: { [key: string]: DisasterData } = {};
    filteredData.forEach((item) => {
      const state = item.State;
      if (
        !item.Probability ||
        typeof item.Probability !== "string" ||
        !item.Probability.includes("%")
      ) {
        return;
      }
      const probability = parseFloat(item.Probability.replace("%", ""));
      if (isNaN(probability)) {
        return;
      }
      if (
        !grouped[state] ||
        probability > parseFloat(grouped[state].Probability.replace("%", ""))
      ) {
        grouped[state] = item;
      }
    });
    return Object.values(grouped).sort((a, b) =>
      a.State.localeCompare(b.State)
    );
  }, [filteredData]);

  // Paginate the grouped data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return groupedData.slice(startIndex, endIndex);
  }, [groupedData, currentPage]);

  const totalPages = Math.ceil(groupedData.length / itemsPerPage);

  // Prepare data for the chart using paginated data
  const chartData = useMemo(
    () => ({
      labels: paginatedData.map((item) => item.State),
      datasets: [
        {
          label: "Disaster Probability (%)",
          data: paginatedData.map((item) =>
            parseFloat(item.Probability.replace("%", ""))
          ),
          backgroundColor: paginatedData.map(
            (item) =>
              disasterColors[item["Disaster Type"]] || disasterColors.Default
          ),
          borderColor: paginatedData.map(
            (item) =>
              disasterBorderColors[item["Disaster Type"]] ||
              disasterBorderColors.Default
          ),
          borderWidth: 1,
          borderRadius: 5,
          barThickness:
            windowWidth < 640 ? 10 : windowWidth < 1024 ? 15 : 20, // Responsive bar thickness
        },
      ],
    }),
    [paginatedData, windowWidth]
  );

  // Create chart options with responsive values
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
      title: {
        display: true,
        text: "Disaster Probability by State",
        font: {
          size:
            windowWidth < 640 ? 18 : windowWidth < 1024 ? 20 : 24, // Responsive font size
          weight: 600,
          family: "Inter",
        },
        color: "#1f2937",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "Inter",
          size: windowWidth < 640 ? 12 : 14,
        },
        bodyFont: {
          family: "Inter",
          size: windowWidth < 640 ? 10 : 12,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const dataset = context.dataset;
            const state = chartData.labels[index];
            const probability = dataset.data[index];
            const disaster = paginatedData[index]["Disaster Type"];
            const year = paginatedData[index].Year;
            return `${state}: ${probability}% (${disaster}, ${year})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "State",
          font: {
            size:
              windowWidth < 640 ? 12 : windowWidth < 1024 ? 14 : 16,
            weight: 500,
            family: "Inter",
          },
          color: "#1f2937",
          padding: 5,
        },
        ticks: {
          font: {
            size:
              windowWidth < 640 ? 8 : windowWidth < 1024 ? 10 : 12,
            family: "Inter",
          },
          color: "#4b5563",
          maxRotation: windowWidth < 640 ? 60 : 45,
          minRotation: windowWidth < 640 ? 60 : 45,
        },
        grid: {
          display: false,
        },
        padding: 10,
      },
      y: {
        title: {
          display: true,
          text: "Probability (%)",
          font: {
            size:
              windowWidth < 640 ? 12 : windowWidth < 1024 ? 14 : 16,
            weight: 500,
            family: "Inter",
          },
          color: "#1f2937",
          padding: 5,
        },
        ticks: {
          font: {
            size:
              windowWidth < 640 ? 8 : windowWidth < 1024 ? 10 : 12,
            family: "Inter",
          },
          color: "#4b5563",
          stepSize: 20,
        },
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        padding: 10,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  }), [windowWidth, chartData.labels, paginatedData]);

  // Reset filters
  const resetFilters = () => {
    setSelectedYear("All");
    setSelectedDisaster("All");
    setSelectedRegion("All");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
          >
            Agency Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-green-100 mt-4"
          >
            Monitor disaster probabilities across states with real-time data and
            insights.
          </motion.p>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="py-6 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 flex justify-center gap-4 flex-wrap">
          <a
            href="/dashboard/agency/tweet-prediction"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg hover:bg-teal-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Tweet Prediction
          </a>
          <a
            href="/dashboard/agency/flood-drought-prediction"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg hover:bg-blue-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Flood and Drought Prediction
          </a>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Filter Toggle Button for Mobile */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            aria-label={isFilterOpen ? "Close Filters" : "Open Filters"}
          >
            {isFilterOpen ? (
              <FaTimes className="mr-2" />
            ) : (
              <FaFilter className="mr-2" />
            )}
            {isFilterOpen ? "Close Filters" : "Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Filter Section */}
          <AnimatePresence>
            {(isFilterOpen || (isBrowser && windowWidth >= 768)) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Filters
                </h2>
                <div className="space-y-6">
                  {/* Year Filter */}
                  <div>
                    <label
                      htmlFor="year-filter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Filter by Year
                    </label>
                    <select
                      id="year-filter"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      aria-label="Filter by Year"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Disaster Type Filter */}
                  <div>
                    <label
                      htmlFor="disaster-filter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Filter by Disaster Type
                    </label>
                    <select
                      id="disaster-filter"
                      value={selectedDisaster}
                      onChange={(e) => setSelectedDisaster(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      aria-label="Filter by Disaster Type"
                    >
                      {disasterTypes.map((disaster) => (
                        <option key={disaster} value={disaster}>
                          {disaster}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Region Filter */}
                  <div>
                    <label
                      htmlFor="region-filter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Filter by Region
                    </label>
                    <select
                      id="region-filter"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      aria-label="Filter by Region"
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Reset Filters Button */}
                  <button
                    onClick={resetFilters}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-sm"
                    aria-label="Reset Filters"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Custom Legend */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
              {Object.keys(disasterColors)
                .filter((key) => key !== "Default")
                .map((disaster) => (
                  <div key={disaster} className="flex items-center">
                    <span
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: disasterColors[disaster] }}
                    ></span>
                    <span className="text-xs sm:text-sm text-gray-700">
                      {disaster}
                    </span>
                  </div>
                ))}
            </div>

            <div
              className="h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 overflow-hidden"
              role="region"
              aria-label="Disaster Probability Chart"
            >
              {/* Pagination Controls at the Top */}
              <div className="flex justify-center items-center mb-4 gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-400 text-white rounded-lg disabled:bg-gray-300 hover:bg-gray-500 transition-all duration-300 shadow-sm"
                  aria-label="Previous Page"
                >
                  <FaArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-green-700 transition-all duration-300 shadow-sm"
                  aria-label="Next Page"
                >
                  <FaArrowRight className="w-5 h-5" />
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
                </div>
              ) : error ? (
                <p className="text-center text-red-600">{error}</p>
              ) : data.length === 0 ? (
                <p className="text-center text-gray-600">
                  No valid data found in the dataset.
                </p>
              ) : paginatedData.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p className="text-center text-gray-600">
                  No data available for the selected filters.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}