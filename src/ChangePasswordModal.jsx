import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShieldAlert, KeyRound, Loader2, Info } from 'lucide-react';
import PasswordInput from './components/PasswordInput';

export default function ChangePasswordModal({ token, onSuccess, onCancel, currentPasswordProvided }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (pw) => {
        return pw.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New and confirm passwords do not match.');
            return;
        }
        if (!validatePassword(newPassword)) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        try {
            // Use the injected temporary token if provided for first-time login, otherwise fallback to local storage for standard resets
            const authToken = token || localStorage.getItem('subAdminToken');

            await axios.post(import.meta.env.VITE_API_URL + '/api/auth/change-password',
                { newPassword },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="glass-panel dark:bg-slate-900/90 p-8 rounded-3xl shadow-2xl border border-white/60 dark:border-slate-700/60 relative overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-300 transition-colors">
            {/* Soft background accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col items-center mb-8 relative z-10 text-center">
                <div className="bg-amber-100/50 dark:bg-amber-500/10 p-4 rounded-2xl mb-4 shadow-sm border border-amber-200/50 dark:border-amber-500/20">
                    <ShieldAlert className="text-amber-500 dark:text-amber-400 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Security Required</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Please set a permanent secure password.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10">
                <div className="space-y-4 mb-6">
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">New Password</label>
                        <PasswordInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="Min 8 characters"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors">Confirm New Password</label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="Must match new password"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-slate-800 to-slate-900 dark:from-blue-600 dark:to-indigo-500 text-white rounded-xl py-4 font-bold hover:shadow-lg hover:shadow-slate-500/20 transform hover:scale-[1.02] active:scale-95 transition-all mt-6 tracking-wide">
                    Update Password
                </button>
            </form>
        </div>
    );
}
