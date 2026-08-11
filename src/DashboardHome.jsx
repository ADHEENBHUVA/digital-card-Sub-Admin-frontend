import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Eye, TrendingUp, Smartphone, Globe, Share2, MousePointerClick } from 'lucide-react';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        cardViews: 0,
        landingViews: 0
    });
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState('');
    const [trafficData, setTrafficData] = useState([]);

    const generateTrafficData = (totalCard, totalLp) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let remainingCard = totalCard;
        let remainingLp = totalLp;

        return days.map((day, i) => {
            let card = 0, lp = 0;
            if (i === 6) {
                card = remainingCard;
                lp = remainingLp;
            } else if (remainingCard > 0 || remainingLp > 0) {
                card = Math.floor(Math.random() * (remainingCard / (7 - i)) * 1.5);
                lp = Math.floor(Math.random() * (remainingLp / (7 - i)) * 1.5);

                // Ensure we don't exceed remaining bounds
                card = Math.min(card, remainingCard);
                lp = Math.min(lp, remainingLp);

                remainingCard -= card;
                remainingLp -= lp;
            }
            return { name: day, card, lp, total: card + lp };
        });
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + '/api/auth/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
                });

                const profile = response.data;
                const views = profile.views || { digitalCard: 0, landingPage: 0 };

                setStats({
                    cardViews: views.digitalCard || 0,
                    landingViews: views.landingPage || 0
                });

                if (profile.slug) setSlug(profile.slug);
                setTrafficData(generateTrafficData(views.digitalCard || 0, views.landingPage || 0));

            } catch (error) {
                console.error("Dashboard data error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);



    const StatCard = ({ title, value, icon: Icon, color, trend }) => {
        const colorStyles = {
            blue: { gradient: 'from-blue-600 to-indigo-600', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            emerald: { gradient: 'from-emerald-500 to-teal-600', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            indigo: { gradient: 'from-violet-600 to-purple-600', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
            pink: { gradient: 'from-pink-500 to-rose-500', text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20' }
        }[color] || { gradient: 'from-slate-600 to-slate-700', text: 'text-slate-600', bg: 'bg-slate-100' };

        return (
            <div className="relative group overflow-hidden bg-white dark:bg-slate-800/90 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-lg shadow-slate-200/40 dark:shadow-none border border-slate-100/80 dark:border-slate-700/50 backdrop-blur-xl">
                {/* Background glowing blob */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${colorStyles.gradient} rounded-full opacity-[0.08] dark:opacity-20 blur-2xl group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity duration-500`}></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{loading ? '...' : value}</h3>
                        </div>
                    </div>
                    <div className={`p-3.5 rounded-2xl ${colorStyles.bg} overflow-hidden relative shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles.gradient} opacity-10`}></div>
                        <Icon size={24} className={`relative z-10 ${colorStyles.text}`} />
                    </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${colorStyles.bg} text-[13px] font-bold ${colorStyles.text}`}>
                        <TrendingUp size={14} strokeWidth={2.5} />
                        <span>+{trend}%</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">vs last week</span>
                </div>

                {/* Bottom colored border accent */}
                <div className={`absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r ${colorStyles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-10">
            {/* Header section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-white dark:to-slate-300 tracking-tight mb-2">My Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Track your digital profile performance and engagement metrics.</p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Card Scans" value={stats.cardViews} icon={Smartphone} color="blue" trend={12} />
                <StatCard title="Profile Views" value={stats.landingViews} icon={Globe} color="emerald" trend={8} />
                <StatCard title="Link Clicks" value={Math.floor((stats.cardViews + stats.landingViews) * 0.4)} icon={MousePointerClick} color="indigo" trend={24} />
                <StatCard title="Total Shares" value={Math.floor((stats.cardViews + stats.landingViews) * 0.15)} icon={Share2} color="pink" trend={18} />
            </div>

            {/* Charts & Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Profile Reach <span className="text-slate-400 text-sm font-medium ml-2">(Last 7 Days)</span></h3>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {stats.cardViews === 0 && stats.landingViews === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <Eye size={48} className="text-slate-400 mb-4" />
                                <p className="font-bold text-slate-500 text-lg">No views yet</p>
                                <p className="text-sm text-slate-400">Share your digital card to start tracking traffic.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCard" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} domain={[0, 'dataMax + 2']} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="card" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCard)" name="Card Scans" />
                                    <Area type="monotone" dataKey="lp" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLp)" name="Page Views" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Dashboard Live Preview */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden flex flex-col justify-between">
                    <div className="flex-1 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Smartphone size={20} className="text-blue-500" /> My Digital Card
                            </h3>
                        </div>

                        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden min-h-[350px]">
                            {slug ? (
                                <iframe
                                    src={`http://localhost:5175/${slug}`}
                                    className="absolute inset-0 w-full h-full border-0 block"
                                    title="Live Preview"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Loading preview...</div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button onClick={() => window.open(`http://localhost:5175/${slug}`, '_blank')} className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
                                Open Full Card
                            </button>
                            <button onClick={() => window.location.href = '/digital-card'} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer">
                                Edit Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to action section */}
            <div className="grid grid-cols-1 mt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800 p-8 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Boost Your Profile Visibility</h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl">Share your Digital Card on social networks and attach it to your email signature to actively increase traffic and capture more leads.</p>
                    </div>
                    <button onClick={() => window.location.href = '/qr-nfc'} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 whitespace-nowrap whitespace-nowrap text-sm flex items-center gap-2">
                        <Share2 size={18} />
                        Get Share Links
                    </button>
                </div>
            </div>
        </div>
    );
}
