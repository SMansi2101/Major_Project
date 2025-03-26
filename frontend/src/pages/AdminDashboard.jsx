import React from 'react';
import Sidebar, { SidebarItem } from "./sidebar";
import { LayoutDashboard, Upload, FileText, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          text="Dashboard"  
          active={location.pathname === "/admin-dashboard"} // Check active route
          onClick={() => navigate("/admin-dashboard")} 
        />
        <SidebarItem 
          icon={<Upload size={20} />} 
          text="Upload Courses" 
          active={location.pathname === "/upload-courses"}
          onClick={() => navigate("/upload-courses")} 
        />
        <SidebarItem 
          icon={<FileText size={20} />} 
          text="Upload Quizzes" 
          active={location.pathname === "/upload-quizzes"}
          onClick={() => navigate("/upload-quizzes")} 
        />
        <SidebarItem 
          icon={<User size={20} />} 
          text="Profile" 
          active={location.pathname === "/admin-profile"}
          onClick={() => navigate("/admin-profile")} 
        />
        <SidebarItem 
          icon={<LogOut size={20} />} 
          text="Logout" 
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/admin-login");
          }} 
        />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage courses, quizzes, and profile from here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
