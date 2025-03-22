import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
    );
}

export default App;
