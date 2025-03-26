import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, User, LogOut } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

const UploadCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState({
    name: "",
    description: "",
    image: null,
    prerequisites: [],
    resources: [],
  });

  const [standard, setStandard] = useState(""); 
  const [prerequisite, setPrerequisite] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setCourse({ ...course, image: e.target.files[0] });
  };

  const addPrerequisite = () => {
    if (standard && prerequisite) {
      setCourse((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, { standard: Number(standard), name: prerequisite }],
      }));
      setPrerequisite("");
    }
  };

  const addResource = () => {
    if (standard && resourceTitle && resourceLink) {
      setCourse((prev) => ({
        ...prev,
        resources: [...prev.resources, { standard: Number(standard), title: resourceTitle, link: resourceLink }],
      }));
      setResourceTitle("");
      setResourceLink("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", course.name);
    formData.append("description", course.description);
    formData.append("standard", standard);  // 🔹 Ensure standard is sent correctly
    formData.append("image", course.image);
    formData.append("prerequisites", JSON.stringify(course.prerequisites)); // 🔹 Convert to JSON string
    formData.append("resources", JSON.stringify(course.resources)); // 🔹 Convert to JSON string

    const token = localStorage.getItem("token");

    try {
        await axios.post(`${API_URL}/admin/upload-course`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        });

        alert("Course uploaded successfully!");
        
        // Reset form after successful upload
        setCourse({
            name: "",
            description: "",
            image: null,
            prerequisites: [],
            resources: [],
        });
        setStandard("");
        setPrerequisite("");
        setResourceTitle("");
        setResourceLink("");

    } catch (error) {
        console.error("Error uploading course:", error.response?.data || error);
        alert("Failed to upload course: " + (error.response?.data?.error || "Unknown error"));
    }
};



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={location.pathname === "/admin-dashboard"} onClick={() => navigate("/admin-dashboard")} />
        <SidebarItem icon={<Upload size={20} />} text="Upload Courses" active={location.pathname === "/upload-courses"} onClick={() => navigate("/upload-courses")} />
        <SidebarItem icon={<FileText size={20} />} text="Upload Quizzes" active={location.pathname === "/upload-quizzes"} onClick={() => navigate("/upload-quizzes")} />
        <SidebarItem icon={<User size={20} />} text="Profile" active={location.pathname === "/admin-profile"} onClick={() => navigate("/admin-profile")} />
        <SidebarItem icon={<LogOut size={20} />} text="Logout" onClick={() => { localStorage.removeItem("token"); navigate("/admin-login"); }} />
      </Sidebar>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Upload Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Course Name" 
            value={course.name} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={course.description} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            required 
            className="w-full border rounded-lg p-2"
          />

          {/* Standard selection */}
          <input 
            type="number" 
            placeholder="Standard (e.g. 5, 6, 7)" 
            value={standard} 
            onChange={(e) => setStandard(e.target.value)} 
            required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          {/* Prerequisites */}
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Add Prerequisite" 
              value={prerequisite} 
              onChange={(e) => setPrerequisite(e.target.value)} 
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button 
              type="button" 
              onClick={addPrerequisite} 
              className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
            >
              Add
            </button>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Resource Title" 
              value={resourceTitle} 
              onChange={(e) => setResourceTitle(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input 
              type="url" 
              placeholder="Resource Link" 
              value={resourceLink} 
              onChange={(e) => setResourceLink(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button 
              type="button" 
              onClick={addResource} 
              className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
            >
              Add Resource
            </button>
          </div>

          <button 
            type="submit" 
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 w-full"
          >
            Upload Course
          </button>
        </form>

        {/* Display prerequisites & resources below the upload button */}
        <div className="mt-6">
          {course.prerequisites.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Prerequisites:</h3>
              <ul className="list-disc ml-5">
                {course.prerequisites.map((p, index) => (
                  <li key={index}>{p.standard} - {p.name}</li>
                ))}
              </ul>
            </div>
          )}

          {course.resources.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-lg">Resources:</h3>
              <ul className="list-disc ml-5">
                {course.resources.map((r, index) => (
                  <li key={index}><a href={r.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{r.title}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCourses;
