import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import AdminDashboard from './pages/admindashboard';
import AdminProtectWrapper from './pages/AdminProtectWrapper';


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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
    );
}

export default App;
