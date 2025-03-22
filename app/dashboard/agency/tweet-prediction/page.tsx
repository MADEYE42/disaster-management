"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaExternalLinkAlt, FaSearch, FaTimes } from "react-icons/fa";

// Interface for a Reddit post
interface RedditPost {
  subreddit: string;
  title: string;
  text: string;
  url: string;
  created_utc: string;
  score: number;
  num_comments: number;
}

export default function TweetPrediction() {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState<string>("");
  const [hoursBack, setHoursBack] = useState<number>(24);

  // Fetch disaster-related Reddit posts
  const fetchRedditPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPosts([]);

      const apiEndpoint = locationInput 
        ? 'http://localhost:5000/api/fetch-and-analyze' // Your Flask endpoint for keyword-based search
        : 'http://localhost:5000/api/reddit-disasters'; // Your Flask endpoint for general disaster posts

      const requestOptions = locationInput
        ? {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              keywords: [locationInput, 'flood', 'earthquake', 'storm', 'hurricane', 'tornado', 'disaster'],
              hours_back: hoursBack
            })
          }
        : {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          };

      const response = await fetch(
        locationInput ? apiEndpoint : `${apiEndpoint}?hours=${hoursBack}`,
        requestOptions
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch Reddit posts');
      }

      setPosts(locationInput ? data.posts : data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch disaster-related posts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location search
  const handleSearch = () => {
    if (!locationInput.trim()) {
      setError("Please enter a location to search for disaster posts.");
      return;
    }
    fetchRedditPosts();
  };

  // Handle clearing the location
  const handleClearLocation = () => {
    setLocationInput("");
    setPosts([]);
    setError(null);
  };

  // Fetch global Reddit posts on component mount if no location is specified
  useEffect(() => {
    if (!locationInput) {
      fetchRedditPosts();
    }
  }, [hoursBack]);

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
            Reddit Disaster Monitor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-green-100 mt-4"
          >
            Real-time disaster updates from Reddit communities.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Location Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter location (e.g., New York)"
                className="w-full p-4 pr-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              {locationInput && (
                <button
                  onClick={handleClearLocation}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear location"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Search for disaster posts"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </div>
          <div className="mt-4 text-center">
            <label className="text-gray-600 mr-2">Time Range:</label>
            <select
              value={hoursBack}
              onChange={(e) => setHoursBack(Number(e.target.value))}
              className="p-2 border rounded-lg"
            >
              <option value={6}>Last 6 hours</option>
              <option value={12}>Last 12 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={48}>Last 48 hours</option>
            </select>
          </div>
        </motion.div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 sm:p-8"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : posts.length > 0 ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">
                {locationInput ? `Disaster Posts About ${locationInput}` : "Recent Disaster Posts"}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        r/{post.subreddit}
                      </span>
                      <span className="text-sm text-gray-500">{post.created_utc}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.text || "No content available."}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">Score: {post.score}</span>
                      <span className="text-sm text-gray-600">Comments: {post.num_comments}</span>
                    </div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-sm text-sm font-medium"
                    >
                      View Post
                      <FaExternalLinkAlt className="ml-2" />
                    </a>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
                <FaExclamationTriangle className="mr-2 text-yellow-500" />
                No Disaster Posts Found
              </h2>
              <p className="text-gray-600">
                {locationInput
                  ? `No recent disaster-related posts found near ${locationInput}.`
                  : "There are currently no recent disaster-related posts available."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}