  import React, { useState } from "react";
  import Sidebar, { SidebarItem } from "./sidebar";
  import { LayoutDashboard, Upload, FileText, User, LogOut } from "lucide-react";
  import { useNavigate, useLocation } from "react-router-dom";
  import axios from "axios";

  const API_URL = import.meta.env.VITE_BASE_URL;

  const UploadQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [quizData, setQuizData] = useState({
      standard: "",
      course: "",
      questions: [
        { text: "", options: ["", "", "", ""], correct: 0 }
      ]
    });

    const handleChange = (e) => {
      setQuizData({ ...quizData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, value) => {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[index].text = value;
      setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[qIndex].options[optIndex] = value;
      setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[qIndex].correct = Number(value); // Store correct answer as 1, 2, 3, or 4
      setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const addQuestion = () => {
      setQuizData((prev) => ({
        ...prev,
        questions: [...prev.questions, { text: "", options: ["", "", "", ""], correct: 1 }] // Default to 1
      }));
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const token = localStorage.getItem("token");
    
      // Ensure standard is a number
      const formattedQuizData = {
        ...quizData,
        standard: Number(quizData.standard),
        questions: quizData.questions.map(q => ({
          text: q.text.trim(),
          options: q.options.map(opt => opt.trim()),
          correct: q.correct > 0 && q.correct <= 4 ? q.correct - 1 : 0, // Ensure correct index is 0-3
        }))
      };
    
      try {
        console.log("Sending data:", JSON.stringify(formattedQuizData, null, 2)); // Debugging log
        await axios.post(`${API_URL}/admin/upload-quiz`, formattedQuizData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        alert("Quiz uploaded successfully!");
        setQuizData({ standard: "", course: "", questions: [{ text: "", options: ["", "", "", ""], correct: 1 }] });
      } catch (error) {
        console.error("Error uploading quiz:", error.response?.data || error);
        alert(`Failed to upload quiz: ${error.response?.data?.error || "Unknown error"}`);
      }
    };
    
    
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={location.pathname === "/admin-dashboard"} onClick={() => navigate("/admin-dashboard")} />
          <SidebarItem icon={<Upload size={20} />} text="Upload Courses" active={location.pathname === "/upload-courses"} onClick={() => navigate("/upload-courses")} />
          <SidebarItem icon={<FileText size={20} />} text="Upload Quizzes" active={location.pathname === "/upload-quizzes"} onClick={() => navigate("/upload-quizzes")} />
          <SidebarItem icon={<User size={20} />} text="Profile" active={location.pathname === "/admin-profile"} onClick={() => navigate("/admin-profile")} />
          <SidebarItem icon={<LogOut size={20} />} text="Logout" onClick={() => { localStorage.removeItem("token"); navigate("/admin-login"); }} />
        </Sidebar>

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Upload Quiz</h1>
          <form className="bg-white p-6 rounded shadow-md mt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Standard:</label>
              <input type="number" name="standard" value={quizData.standard} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="Enter standard" required />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Course:</label>
              <input type="text" name="course" value={quizData.course} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder="Enter course name" required />
            </div>

            {quizData.questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded mt-4 bg-gray-50">
                <h3 className="font-semibold">Question {qIndex + 1}</h3>
                <input type="text" value={q.text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} className="w-full p-2 border rounded mt-1" placeholder="Enter question" required />

                <h4 className="mt-2 font-medium">Options:</h4>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center mt-1">
                    <input type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} className="w-full p-2 border rounded" placeholder={`Option ${optIndex + 1}`} required />
                  </div>
                ))}

                <h4 className="mt-2 font-medium">Correct Answer:</h4>
                <select value={q.correct} onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)} className="w-full p-2 border rounded">
                  {q.options.map((opt, optIndex) => (
                    <option key={optIndex} value={optIndex + 1}>{opt}</option> // Show 1-4 instead of 0-3
                  ))}
                </select>

              </div>
            ))}

            <button type="button" onClick={addQuestion} className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full">
              + Add Another Question
            </button>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full mt-4">
              Submit Quiz
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default UploadQuiz;