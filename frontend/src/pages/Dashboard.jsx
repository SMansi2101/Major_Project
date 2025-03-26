import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error("Invalid API response format:", response.data);
          setCourses([]); // Fallback
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);


  // Filter courses based on search input
  const filteredCourses = courses.map(course => ({
    ...course,
    name: course.courseId?.name, // Extract name from `courseId`
  })).filter(course => course.name?.toLowerCase().includes(search.toLowerCase()));


  console.log("Courses received:", courses);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center">
          <img src="images/Logo.png" alt="Logo" className="h-10 mr-3" />
          <h1 className="text-2xl font-semibold">CareerExplorer</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            key={course._id}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer h-[400px] flex flex-col"
            whileHover={{ scale: 1.02 }} // Reduced hover scaling
          >
            <img
              src={`${API_URL}${course.courseId?.image}`} // Ensure it fetches from courseId
              alt={course.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="mt-4 text-xl font-semibold">{course.name}</h2>

            {/* Increased description space */}
            <p className="mt-2 text-gray-600 flex-grow overflow-hidden text-ellipsis line-clamp-4 min-h-[80px]">
              {course.courseId?.description || "No description available"}
            </p>

            {/* Link to Course Details */}
            <Link to={`/courses/${course._id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition w-full"
              >
                Explore
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 bg-white shadow-md mt-6">
        &copy; 2025 CareerExplorer. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
