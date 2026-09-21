import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreditCard, Power, Search, Filter, Loader2, BarChart3, AlertCircle, Edit2, Check, X } from 'lucide-react';

export default function NfcCardManagement() {
    const [cards, setCards] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // For editing card name
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const fetchCards = async () => {
        setLoading(true);
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/api/nfc-cards', {
                headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
            });
            setCards(response.data.cards);
            setTotalCount(response.data.totalCount);
        } catch (err) {
            toast.error('Failed to load NFC cards');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/nfc-cards/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
            });
            
            toast.success(`Card ${currentStatus === 'Active' ? 'Disabled' : 'Activated'} successfully`);
            fetchCards();
        } catch (err) {
            toast.error('Failed to update card status');
        }
    };

    const handleSaveName = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/nfc-cards/${id}/name`, { cardName: editName }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
            });
            toast.success('Card name updated');
            setEditingId(null);
            fetchCards();
        } catch (err) {
            toast.error('Failed to update card name');
        }
    };

    const startEditing = (card) => {
        setEditingId(card._id);
        setEditName(card.cardName || 'Unnamed Card');
    };

    const filteredCards = cards.filter(card => 
        card.cardId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (card.cardName && card.cardName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Stats Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden flex items-center justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                            <CreditCard className="text-blue-500" size={32} />
                            NFC Card Management
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Auto-synced written cards appear here. Name them to identify if lost.</p>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between relative z-10 mb-4">
                        <span className="text-indigo-100 font-bold uppercase tracking-wider text-sm">Total Cards Written</span>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <BarChart3 className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="text-5xl font-black text-white relative z-10">
                        {totalCount}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Written Cards History</h3>
                    
                    <div className="relative w-full sm:w-auto flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or Name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white py-2 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="animate-spin mb-3 text-blue-500" size={32} />
                            <p className="font-semibold animate-pulse tracking-wide">Syncing Cards...</p>
                        </div>
                    ) : filteredCards.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                            <AlertCircle className="mb-3 text-slate-300 dark:text-slate-600" size={48} />
                            <p className="font-semibold text-lg text-slate-500 dark:text-slate-400">No cards found</p>
                            <p className="text-sm">Cards will appear here automatically when written.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold border-b border-slate-100 dark:border-slate-700">Card ID</th>
                                    <th className="p-4 font-bold border-b border-slate-100 dark:border-slate-700">Card Name</th>
                                    <th className="p-4 font-bold border-b border-slate-100 dark:border-slate-700">Tap Count</th>
                                    <th className="p-4 font-bold border-b border-slate-100 dark:border-slate-700">Date & Time</th>
                                    <th className="p-4 font-bold border-b border-slate-100 dark:border-slate-700">Status</th>
                                    <th className="p-4 font-bold border-b border-slate-100 dark:border-slate-700 text-right">Deactivate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredCards.map((card) => (
                                    <tr key={card._id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group ${card.status === 'Disabled' ? 'opacity-70' : ''}`}>
                                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <CreditCard size={16} />
                                                </div>
                                                <span className="font-mono text-sm">{card.cardId}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {editingId === card._id ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="border border-blue-500 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white w-40 focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveName(card._id)} className="text-emerald-500 hover:bg-emerald-50 p-1 rounded">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 group/edit">
                                                    <span className={`font-semibold ${card.isMasterCard ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {card.cardName || 'Unnamed Card'}
                                                        {card.isMasterCard && (
                                                            <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                                                        )}
                                                    </span>
                                                    {!card.isMasterCard && (
                                                        <button onClick={() => startEditing(card)} className="text-slate-400 opacity-0 group-hover/edit:opacity-100 hover:text-blue-500 transition-all">
                                                            <Edit2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full font-bold text-sm">
                                                {card.tapCount || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(card.writeDate).toLocaleDateString('en-GB')} <br/>
                                            <span className="text-xs opacity-80">{new Date(card.writeDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                card.status === 'Active' 
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${card.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                                                {card.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(card._id, card.status)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                                                    card.status === 'Active' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                                                }`}
                                            >
                                                <span className="sr-only">Toggle card status</span>
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        card.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
