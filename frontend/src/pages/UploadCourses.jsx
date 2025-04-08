import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./sidebar";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, User, LogOut } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

const UploadCourses = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: "",
    description: "",
    image: null,
    standards: [],
  });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setCourse({ ...course, image: e.target.files[0] });
  };

  const addStandard = () => {
    setCourse((prev) => ({
      ...prev,
      standards: [...prev.standards, { standard: "", prerequisites: [{ title: "", subPrerequisites: [""] }], resources: [{ title: "", link: "" }] }],
    }));
  };

  const updateStandard = (index, value) => {
    const updatedStandards = [...course.standards];
    updatedStandards[index].standard = value;
    setCourse({ ...course, standards: updatedStandards });
  };

  const updatePrerequisiteTitle = (stdIndex, pIndex, value) => {
    const updatedStandards = [...course.standards];
    updatedStandards[stdIndex].prerequisites[pIndex].title = value;
    setCourse({ ...course, standards: updatedStandards });
  };

  const updateSubPrerequisite = (stdIndex, pIndex, spIndex, value) => {
    const updatedStandards = [...course.standards];
    updatedStandards[stdIndex].prerequisites[pIndex].subPrerequisites[spIndex] = value;
    setCourse({ ...course, standards: updatedStandards });
  };

  const addPrerequisiteField = (index) => {
    const updatedStandards = [...course.standards];
    updatedStandards[index].prerequisites.push({ title: "", subPrerequisites: [""] });
    setCourse({ ...course, standards: updatedStandards });
  };

  const addSubPrerequisiteField = (stdIndex, pIndex) => {
    const updatedStandards = [...course.standards];
    updatedStandards[stdIndex].prerequisites[pIndex].subPrerequisites.push("");
    setCourse({ ...course, standards: updatedStandards });
  };

  const updateResourceTitle = (stdIndex, rIndex, value) => {
    const updatedStandards = [...course.standards];
    updatedStandards[stdIndex].resources[rIndex].title = value;
    setCourse({ ...course, standards: updatedStandards });
  };

  const updateResourceLink = (stdIndex, rIndex, value) => {
    const updatedStandards = [...course.standards];
    updatedStandards[stdIndex].resources[rIndex].link = value;
    setCourse({ ...course, standards: updatedStandards });
  };

  const addResourceField = (index) => {
    const updatedStandards = [...course.standards];
    updatedStandards[index].resources.push({ title: "", link: "" });
    setCourse({ ...course, standards: updatedStandards });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", course.name);
    formData.append("description", course.description);
    formData.append("image", course.image);
    formData.append("standards", JSON.stringify(course.standards));

    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_URL}/admin/upload-course`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
      alert("Course uploaded successfully!");
      setCourse({ name: "", description: "", image: null, standards: [] });
    } catch (error) {
      console.error("Error uploading course:", error.response?.data || error.message);
      alert("Failed to upload course");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={() => navigate("/admin-dashboard")} />
        <SidebarItem icon={<Upload size={20} />} text="Upload Courses" active onClick={() => navigate("/upload-courses")} />
        <SidebarItem icon={<FileText size={20} />} text="Upload Quizzes" onClick={() => navigate("/upload-quizzes")} />
        <SidebarItem icon={<User size={20} />} text="Profile" onClick={() => navigate("/admin-profile")} />
        <SidebarItem icon={<LogOut size={20} />} text="Logout" onClick={() => { localStorage.removeItem("token"); navigate("/admin-login"); }} />
      </Sidebar>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Upload Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Course Name" value={course.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          <textarea name="description" placeholder="Description" value={course.description} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full border rounded-lg p-2" />

          {course.standards.map((std, index) => (
            <div key={index} className="border p-4 rounded-lg mt-4">
              <input type="number" placeholder="Standard" value={std.standard} onChange={(e) => updateStandard(index, e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-2" />

              {std.prerequisites.map((p, pIndex) => (
                <div key={pIndex} className="mb-2">
                  <input type="text" placeholder="Prerequisite Title" value={p.title} onChange={(e) => updatePrerequisiteTitle(index, pIndex, e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-1" />
                  {p.subPrerequisites.map((sp, spIndex) => (
                    <input key={spIndex} type="text" placeholder="Sub-Prerequisite" value={sp} onChange={(e) => updateSubPrerequisite(index, pIndex, spIndex, e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-1" />
                  ))}
                  <button type="button" onClick={() => addSubPrerequisiteField(index, pIndex)} className="bg-blue-400 text-white px-4 py-2 rounded-lg mb-2">Add Sub-Prerequisite</button>
                </div>
              ))}

              <button type="button" onClick={() => addPrerequisiteField(index)} className="bg-green-400 text-white px-4 py-2 rounded-lg mb-2">Add Prerequisite</button>

              {/* New: Resource Input Fields */}
              {std.resources.map((res, rIndex) => (
                <div key={rIndex} className="mb-2">
                  <input type="text" placeholder="Resource Title" value={res.title} onChange={(e) => updateResourceTitle(index, rIndex, e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-1" />
                  <input type="text" placeholder="Resource Link" value={res.link} onChange={(e) => updateResourceLink(index, rIndex, e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-1" />
                </div>
              ))}

              <button type="button" onClick={() => addResourceField(index)} className="bg-yellow-400 text-white px-4 py-2 rounded-lg mb-2">Add Resource</button>
            </div>
          ))}


          <button type="button" onClick={addStandard} className="bg-green-500 text-white px-4 py-2 rounded-lg">Add Standard</button>
          <button type="submit" className="bg-purple-500 text-white px-6 py-2 rounded-lg w-full">Upload Course</button>
        </form>
      </div>
    </div>
  );
};

export default UploadCourses;
