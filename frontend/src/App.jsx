import { Routes, Route } from "react-router-dom";
import UploadCourses from "./pages/UploadCourses";
import UploadQuizz from "./pages/UploadQuizz";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectWrapper from './pages/AdminProtectWrapper';
import QuizPage from "./pages/Quizpage";



function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<Login />} />
            <Route path="/admin-dashboard" element={
                <AdminProtectWrapper>
                    <AdminDashboard />
                </AdminProtectWrapper>
                } />
            <Route path="/upload-courses" element={<UploadCourses />} />
            <Route path="/upload-quizzes" element={<UploadQuizz />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
    );
}

export default App;
