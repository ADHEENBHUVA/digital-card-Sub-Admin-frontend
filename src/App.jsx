import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useEffect } from 'react';

import Login from './Login';
import Dashboard from './Dashboard';
import ProfileForm from './ProfileForm';
import SecurityForm from './SecurityForm';
import QrPanel from './QrPanel';
import DigitalCardConfig from './DigitalCardConfig';
import DashboardHome from './DashboardHome';
import InquiriesList from './InquiriesList';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('subAdminToken');
    return token ? children : <Navigate to="/login" />;
};

const AxiosInterceptorProvider = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    const errorCode = error.response.data?.code;

                    let errorMessage = 'Your session is no longer valid. Please login again.'; // default

                    if (errorCode === 'TOKEN_EXPIRED') {
                        errorMessage = 'Your session has expired. Please login again.';
                    } else if (errorCode === 'SESSION_INVALIDATED') {
                        errorMessage = 'Your password was changed by an administrator. Please login again using your new password.';
                    } else if (errorCode === 'UNAUTHORIZED') {
                        errorMessage = 'Not authorized, please login.';
                    }

                    localStorage.removeItem('subAdminToken');
                    localStorage.removeItem('subAdminUser');
                    toast.error(errorMessage, { autoClose: 5000 });
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [navigate]);

    return children;
};

function App() {
    return (
        <Router>
            <AxiosInterceptorProvider>
                <ToastContainer position="top-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                        <Route index element={<DashboardHome />} />
                        <Route path="profile" element={<ProfileForm />} />
                        <Route path="security" element={<SecurityForm />} />
                        <Route path="digital-card" element={<DigitalCardConfig />} />
                        <Route path="qr-nfc" element={<QrPanel />} />
                        <Route path="inquiries" element={<InquiriesList />} />
                    </Route>

                </Routes>
            </AxiosInterceptorProvider>
        </Router>
    );
}

export default App;
