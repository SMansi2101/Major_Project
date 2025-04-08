import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BASE_URL;

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [openPrerequisite, setOpenPrerequisite] = useState(null); // Track open prerequisite title

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
    <motion.div
      className="min-h-screen bg-gray-100 p-8 flex gap-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Side: Image & Description */}
      <div className="w-2/3">
        <motion.img
          src={`${API_URL}${course.image}`}
          alt={course.name}
          className="w-full h-64 object-cover rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className="mt-6 bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">{course.description}</p>
        </motion.div>
      </div>

      {/* Right Side: Prerequisites, Resources & Quiz Button */}
      <motion.div
        className="w-1/3 bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Prerequisites Section */}
        <h2 className="text-2xl font-semibold text-gray-700">Prerequisites</h2>
        <ul className="mt-3 space-y-2">
          {course.prerequisites?.map((p, index) => (
            <li key={index} className="bg-gray-200 rounded-lg p-3">
              {/* Clickable Prerequisite Title */}
              <button
                onClick={() => setOpenPrerequisite(openPrerequisite === index ? null : index)}
                className="w-full text-left font-semibold text-gray-800 flex justify-between items-center"
              >
                {p.title}
                <span>{openPrerequisite === index ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown for Sub-Prerequisites */}
              {openPrerequisite === index && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 pl-4 space-y-1 text-gray-600"
                >
                  {p.subPrerequisites.map((sub, subIndex) => (
                    <li key={subIndex} className="text-sm list-disc">{sub.name}</li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </ul>

        {/* Resources Section */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Resources</h2>
        <ul className="mt-2 space-y-2">
          {course.resources?.map((r, index) => (
            <li key={index}>
              <a href={r.link} target="_blank" className="text-blue-500 underline">
                {r.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Start Quiz Button */}
        <Link to={`/quiz/${course.courseId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition w-full"
          >
            Start Quiz
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default CourseDetails;
