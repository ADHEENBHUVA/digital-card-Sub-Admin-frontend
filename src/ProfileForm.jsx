import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, UserCircle, Shield, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', mobile: '', email: '',
        profile: { companyName: '', designation: '', address: '' }
    });
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState({ digitalCard: 0, landingPage: 0 });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + '/api/auth/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
                });
                const data = response.data;
                setFormData({
                    fullName: data.fullName || '',
                    mobile: data.mobile || '',
                    email: data.email || '',
                    profile: {
                        companyName: data.profile?.companyName || '',
                        designation: data.profile?.designation || '',
                        address: data.profile?.address || ''
                    }
                });

                if (data.views) {
                    setViews(data.views);
                }

                // Expose account info silently for the UI
                if (!window.subAdminAccountCache) window.subAdminAccountCache = {};
                window.subAdminAccountCache = {
                    username: data.username,
                    role: data.role,
                    status: data.status
                };
            } catch (err) {
                toast.error('Failed to load profile');
            } finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(import.meta.env.VITE_API_URL + '/api/sub-admin/profile', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
            });
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3 text-primary" size={32} />
            <p className="font-semibold animate-pulse tracking-wide">Loading Editor...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden relative transition-colors">

                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-2xl">
                        <UserCircle className="text-primary dark:text-blue-400 w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                            Profile Editor
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your personal and account details.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Landing Page Views</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{views.landingPage}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800/50 shadow-sm">
                            <Shield size={24} />
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Digital Card Scans</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{views.digitalCard}</h3>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center border border-purple-200 dark:border-purple-800/50 shadow-sm">
                            <Share2 size={24} />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-10 relative z-10">

                    <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Identity Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={(e) => handleChange(e)} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Mobile Number</label>
                                <input type="text" name="mobile" value={formData.mobile} onChange={(e) => handleChange(e)} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={(e) => handleChange(e)} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Designation</label>
                                <input type="text" name="designation" value={formData.profile.designation} onChange={(e) => handleChange(e, 'profile')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                            </div>
                            <div className="col-span-1 md:col-span-2 group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 transition-colors">Company Name</label>
                                <input type="text" name="companyName" value={formData.profile.companyName} onChange={(e) => handleChange(e, 'profile')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
                            </div>
                            <div className="col-span-1 md:col-span-2 group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Business / Office Address</label>
                                <textarea name="address" value={formData.profile.address} onChange={(e) => handleChange(e, 'profile')} rows="3" className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none" placeholder="Enter full address..."></textarea>
                            </div>
                        </div>

                        {/* Account Core Details */}
                        {window.subAdminAccountCache && (
                            <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Login Username</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{window.subAdminAccountCache.username}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Permissions</p>
                                        <p className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-blue-900/40 dark:text-blue-400 font-bold text-xs tracking-wide">
                                            {window.subAdminAccountCache.role.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                        <p className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                            {window.subAdminAccountCache.status.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="pt-4 pb-2">
                        <button type="submit" className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-indigo-500 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-slate-900/20 transform hover:-translate-y-1 active:scale-[0.98] transition-all tracking-wide text-lg">
                            Deploy Details
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
