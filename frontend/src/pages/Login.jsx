import React, { useState } from "react";
import axios from "axios";
import { useNavigate} from 'react-router-dom';

const Login = () => {
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:4000/admin/login", { email, password });
            
            if (data.token) {
                localStorage.setItem("token", data.token); // ✅ Store token in localStorage
                setAdmin(data.admin); 
                navigate("/admin-dashboard"); // ✅ Redirect user after login
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Admin Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
