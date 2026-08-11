import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Phone, ExternalLink, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function InquiriesList() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInquiries = async () => {
        try {
            const token = localStorage.getItem('subAdminToken');
            const res = await axios.get(import.meta.env.VITE_API_URL + '/api/digital-card/inquiries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInquiries(res.data);
        } catch (error) {
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('subAdminToken');
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/digital-card/inquiries/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchInquiries();
            toast.success('Inquiry marked as read');
        } catch (err) {
            toast.error('Failed to update inquiry status');
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Customer Inquiries</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and respond to leads sent from your Digital Business Card.</p>
            </div>

            {inquiries.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                    <Mail className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Imquiries Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">When customers fill out your contact form, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inquiries.map((inquiry) => (
                        <div key={inquiry._id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border transition-shadow ${inquiry.isRead ? 'border-slate-100 dark:border-slate-700' : 'border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900 shadow-blue-50/50'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white capitalize">{inquiry.name}</h3>
                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                {!inquiry.isRead ? (
                                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold rounded-full flex items-center shadow-sm">
                                        <Clock className="w-3 h-3 mr-1" /> New
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 text-xs font-bold rounded-full flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Read
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3 mb-6">
                                <a href={`mailto:${inquiry.email}`} className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                                    <Mail className="w-4 h-4 mr-2.5 text-slate-400" />
                                    {inquiry.email}
                                </a>
                                {inquiry.phone && (
                                    <a href={`tel:${inquiry.phone}`} className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                                        <Phone className="w-4 h-4 mr-2.5 text-slate-400" />
                                        {inquiry.phone}
                                    </a>
                                )}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-6">
                                <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{inquiry.message}"</p>
                            </div>

                            {!inquiry.isRead && (
                                <button
                                    onClick={() => markAsRead(inquiry._id)}
                                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center text-sm"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
