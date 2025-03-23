import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Web Development",
    image: "images/webdev.jpg",
    description: "Learn HTML, CSS, JavaScript, and React to build modern websites.",
  },
  {
    id: 2,
    title: "Data Science",
    image: "images/datascience.jpg",                
    description: "Master Python, machine learning, and AI-driven analytics.",
  },
  {
    id: 3,
    title: "Cyber Security",
    image: "images/cybersecurity.jpg",
    description: "Understand ethical hacking, cryptography, and network security.",
  },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

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
            key={course.id}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h2 className="mt-4 text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-gray-600">{course.description}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Explore
            </motion.button>
          </motion.div>
        ))}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 bg-white shadow-md mt-6">
        &copy; 2023 CareerExplorer. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
