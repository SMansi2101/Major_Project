import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminDataContext = createContext();

const AdminContext = ({ children }) => {
    const [admin, setAdmin] = useState(null);

    const checkAdminAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found. Admin is not authenticated.");
            return;
        }

        try {
            const { data } = await axios.get("http://localhost:4000/admin/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });


            setAdmin(data.admin);
        } catch (error) {
            console.error("Admin auth check failed:", error.response?.data?.message);
            localStorage.removeItem("token");
        }
    };

    useEffect(() => {
        if(!admin)  checkAdminAuth();
    }, [admin]);

    return (
        <AdminDataContext.Provider value={{ admin, checkAdminAuth }}>
            {children}
        </AdminDataContext.Provider>
    );
};

export default AdminContext;
