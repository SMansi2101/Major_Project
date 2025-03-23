import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {  // ✅ Use named export
    const [student, setStudent] = useState(null);

    return (
        <StudentContext.Provider value={{ student, setStudent }}> 
            {children}
        </StudentContext.Provider>
    );
};
