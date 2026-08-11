import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { KeyRound, Save, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './components/PasswordInput';

export default function SecurityForm() {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordSaving, setPasswordSaving] = useState(false);

    const handlePasswordDataChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New password and confirm password do not match.');
        }

        if (passwordData.newPassword.length < 6) {
            return toast.error('Password does not meet the required security rules.');
        }

        setPasswordSaving(true);
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/auth/change-password', {
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
            });

            // Auto logout
            localStorage.removeItem('subAdminToken');
            localStorage.removeItem('subAdminUser');
            toast.success('Password changed successfully. Please login again with your new password.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to change password.';
            toast.error(errorMsg);
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-5 mb-10 relative z-10">
                    <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-4 rounded-2xl shadow-lg shadow-rose-500/20 text-white">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
                            Account Security
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Manage and update your login credentials safely.</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="relative z-10 space-y-8 bg-slate-50/50 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group relative">
                            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mb-2.5 group-focus-within:text-rose-500 transition-colors">New Password</label>
                            <PasswordInput
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordDataChange}
                                required
                                placeholder="Min 6 characters"
                                className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-4 pl-5 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm text-lg"
                            />
                        </div>
                        <div className="group relative">
                            <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mb-2.5 group-focus-within:text-rose-500 transition-colors">Confirm New Password</label>
                            <PasswordInput
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordDataChange}
                                required
                                placeholder="Match your new password"
                                className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-4 pl-5 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm text-lg"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={passwordSaving} className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-amber-500/20 transform hover:-translate-y-1 hover:scale-105 active:scale-[0.98] transition-all text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3">
                            {passwordSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} Update Password
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
