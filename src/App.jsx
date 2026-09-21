import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useEffect } from 'react';
import useTheme from './hooks/useTheme';

import React, { Suspense, lazy } from 'react';

const Login = lazy(() => import('./Login'));
const Dashboard = lazy(() => import('./Dashboard'));
const ProfileForm = lazy(() => import('./ProfileForm'));
const SecurityForm = lazy(() => import('./SecurityForm'));
const QrPanel = lazy(() => import('./QrPanel'));
const DigitalCardConfig = lazy(() => import('./DigitalCardConfig'));
const DashboardHome = lazy(() => import('./DashboardHome'));
const NfcCardManagement = lazy(() => import('./NfcCardManagement'));

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
                const originalRequest = error.config;
                const isLoginReq = originalRequest && originalRequest.url && originalRequest.url.includes('/login');

                if (error.response && error.response.status === 401 && !isLoginReq) {
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
                    toast.dismiss(); // Clear any existing toasts to avoid duplicates
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
    const { theme } = useTheme();

    return (
        <Router>
            <AxiosInterceptorProvider>
                <ToastContainer position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} />
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-500 font-medium">Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                            <Route index element={<DashboardHome />} />
                            <Route path="profile" element={<ProfileForm />} />
                            <Route path="security" element={<SecurityForm />} />
                            <Route path="digital-card" element={<DigitalCardConfig />} />
                            <Route path="qr-nfc" element={<QrPanel />} />
                            <Route path="nfc-cards" element={<NfcCardManagement />} />
                        </Route>

                    </Routes>
                </Suspense>
            </AxiosInterceptorProvider>
        </Router>
    );
}

export default App;
