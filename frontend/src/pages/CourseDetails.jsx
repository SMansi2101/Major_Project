import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_BASE_URL;

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (!course) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <div className="w-2/3 pr-8">
        {/* Smooth fade-in and scale animation */}
        <motion.img
          src={`${API_URL}${course.image}`}
          alt={course.name}
          className="w-80 h-48 object-cover rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Course Name and Description */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
          <p className="text-gray-600 mt-3">{course.description}</p>
        </motion.div>
      </div>

      {/* Right-side: Prerequisites, Resources, and Quiz Button */}
      <motion.div
        className="w-1/3 bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700">Prerequisites</h2>
        <ul className="list-disc pl-5 mt-2 text-gray-600">
          {course.prerequisites.map((p, index) => (
            <li key={index}>
              {p.name}
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Resources</h2>
        <ul className="mt-2 space-y-2">
          {course.resources.map((r, index) => (
            <li key={index}>
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {r.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Start Quiz Button */}
        <motion.button
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-full"
          whileHover={{ scale: 1.05 }}
        >
          Start Quiz
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CourseDetails;
