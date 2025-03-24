"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaArrowDown,
  FaPlay,
  FaTimes,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaArrowUp,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [disasters, setDisasters] = useState<string[]>([]); // State for disaster headlines
  const featuresRef = useRef<HTMLElement>(null);

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch disaster news from NewsAPI
  useEffect(() => {
    const apiKey = "ac0ed998e7734d4f92c020afa1099032"; // Replace with your actual NewsAPI key
    const url = `https://newsapi.org/v2/everything?q=flood OR earthquake OR cyclone&sortBy=publishedAt&apiKey=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const recentDisasters = data.articles
          .slice(0, 3)
          .map((article: { title: string; publishedAt: string }) => {
            const publishedAt = new Date(article.publishedAt);
            const hoursAgo = Math.floor(
              (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60)
            );
            return `${article.title} - ${hoursAgo} hours ago`;
          });
        setDisasters(recentDisasters);
      })
      .catch((error) => console.error("Error fetching disaster news:", error));
  }, []);

  const handleScrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10 animate-subtle-parallax"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 relative z-10">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
            >
              Disaster Management App
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 leading-relaxed"
            >
              Your all-in-one solution for disaster preparedness, response, and
              recovery. Stay informed, connected, and safe.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a
                href="/register"
                className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-400 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Get Started
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6"
            >
              <button
                onClick={handleScrollToFeatures}
                className="flex items-center gap-2 mx-auto md:mx-0 px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Explore Features <FaArrowDown className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <motion.img
              src="https://images.unsplash.com/photo-1541710005980-7ea80ff232d6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              alt="Disaster Management Illustration"
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Recent Disasters Ticker */}
      {/* Recent Disaster Headlines */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-6">
        <div className="container mx-auto px-6">
          <h3 className="text-xl font-semibold text-center mb-4 text-white">
            Recent Disaster Headlines
          </h3>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {disasters.length > 0 ? (
                disasters.map((disaster, index) => (
                  <div
                    key={index}
                    className="bg-white text-black px-4 py-2 rounded-lg shadow-md min-w-[300px] flex-shrink-0 flex items-center justify-between"
                  >
                    <span className="text-sm md:text-base font-medium">
                      {disaster.split(" - ")[0]}
                    </span>
                    <span className="text-sm text-red-800 font-semibold">
                      {disaster.split(" - ")[1]}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white text-black px-4 py-2 rounded-lg shadow-md min-w-[300px] flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm md:text-base">
                    Loading disaster news...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-gray-900"
          >
            Comprehensive Disaster Support
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="text-center bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt="Mental Health AI"
                  className="w-48 h-48 mx-auto rounded-lg mb-6 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Mental Health AI
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Support for post-disaster victims with AI-driven mental health
                tools.
              </p>
              <a
                href="/mental-health"
                className="text-green-600 font-medium hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Learn More →
              </a>
            </motion.div>
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ rotate: -2, scale: 1.05 }}
              className="text-center bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/21792122/pexels-photo-21792122/free-photo-of-smartphone-with-911-dialled.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Emergency Contacts"
                  className="w-48 h-48 mx-auto rounded-lg mb-6 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Emergency Contacts
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access trustworthy emergency contacts instantly.
              </p>
              <a
                href="/emergency-contacts"
                className="text-green-600 font-medium hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Learn More →
              </a>
            </motion.div>
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="text-center bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/6646778/pexels-photo-6646778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Community Support"
                  className="w-48 h-48 mx-auto rounded-lg mb-6 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Community Support
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Join a community for interaction and mutual help.
              </p>
              <a
                href="/community"
                className="text-green-600 font-medium hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Learn More →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            {[
              {
                title: "Real-Time Updates",
                desc: "Stay informed with real-time disaster tweets and predictions.",
              },
              {
                title: "Educational Resources",
                desc: "Access emergency guides and educational videos.",
              },
              {
                title: "Global Predictions",
                desc: "International and national disaster predictions.",
              },
              {
                title: "Flood & Drought Alerts",
                desc: "Get timely flood and drought predictions.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              src="https://img.freepik.com/premium-photo/road-sign-by-buildings-against-sky-city_1048944-24051375.jpg"
              alt="Disaster Preparedness"
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-gray-900"
          >
            What Our Users Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Jane Doe",
                role: "Volunteer",
                quote:
                  "This app helped me stay prepared during the recent floods. The real-time updates were a lifesaver!",
              },
              {
                name: "John Smith",
                role: "User",
                quote:
                  "The mental health AI support was incredible after the earthquake. I felt supported and understood.",
              },
              {
                name: "Emily Johnson",
                role: "Agency",
                quote:
                  "The community support feature allowed us to coordinate relief efforts efficiently.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <h4 className="font-semibold text-lg text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              src="https://images.pexels.com/photos/70573/fireman-firefighter-rubble-9-11-70573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Stay Safe"
              className="w-full rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 text-center md:text-left space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900"
            >
              Be Prepared, Stay Safe
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              Our app equips you with the tools and knowledge to handle
              disasters effectively. Join us today and take control of your
              safety.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <a
                href="/register"
                className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-green-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Join Now
              </a>
              <button
                onClick={() => setShowVideoModal(true)}
                className="inline-block bg-gray-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <FaPlay className="inline-block mr-2" /> Watch Quick Tour
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Quick Tour
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Quick Tour Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}