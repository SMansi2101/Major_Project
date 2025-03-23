import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";  // ✅ Correct import
import AdminProvider from './context/AdminContext';
import { StrictMode } from 'react';
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AdminProvider>
            <StudentProvider>  
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </StudentProvider>
        </AdminProvider>
    </StrictMode>
);
