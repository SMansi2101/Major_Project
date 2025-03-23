import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!token) {
            navigate('/admin-login');
        }
    }, [token, navigate]);

    return token ? <>{children}</> : null;
};

export default AdminProtectWrapper;
