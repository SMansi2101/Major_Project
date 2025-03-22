import { createContext, useState } from "react";

export const StudentContext = createContext(null);

const StudentProvider = ({ children }) => {
    const [student, setStudent] = useState(null);

    return (
        <StudentContext.Provider value={{ student, setStudent }}> 
            {children}
        </StudentContext.Provider>
    );
};

export default StudentProvider;
