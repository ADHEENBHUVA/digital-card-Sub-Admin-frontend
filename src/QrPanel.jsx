import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { QrCode, Link as LinkIcon, Download, Copy, ScanLine, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export default function QrPanel() {
    const [data, setData] = useState({ qrCodeUrl: '', nfcUrl: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQrData = async () => {
            try {
                const qrRes = await axios.get(import.meta.env.VITE_API_URL + '/api/sub-admin/qr', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
                });
                const nfcRes = await axios.get(import.meta.env.VITE_API_URL + '/api/sub-admin/nfc', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('subAdminToken')}` }
                });
                setData({ qrCodeUrl: qrRes.data.qrCodeUrl, nfcUrl: nfcRes.data.nfcUrl });
            } catch (err) {
                toast.error('Failed to load QR/NFC data');
            } finally {
                setLoading(false);
            }
        };
        fetchQrData();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data.nfcUrl);
        toast.success("Link copied directly to clipboard!");
    };

    const handleDownloadPdf = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text("Appifly - Business Card", 105, 30, { align: "center" });

            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = `${import.meta.env.VITE_API_URL}${data.qrCodeUrl}`;

            img.onload = () => {
                doc.addImage(img, 'PNG', 55, 50, 100, 100);
                doc.save("Appifly_QR_Code.pdf");
                toast.success("PDF Generated Successfully!");
            };
            img.onerror = () => {
                toast.error("Failed to load QR image for PDF");
            };
        } catch (error) {
            toast.error("Error creating PDF");
        }
    };

    const handleDownloadPng = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${data.qrCodeUrl}`);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = "Appifly_Business_Card_QR.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("PNG Downloaded!");
        } catch (error) {
            toast.error("Failed to download PNG");
        }
    };

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
            <ScanLine className="animate-pulse mb-3 text-primary" size={32} />
            <p className="font-semibold tracking-wide">Fetching QR Assets...</p>
        </div>
    );

    return (
        <div className="max-w-3xl flex flex-col items-center mx-auto mt-4 animate-in fade-in zoom-in-95 duration-500">

            {/* Soft background glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 w-full text-center relative z-10 transition-colors">
                <div className="inline-flex bg-primary/10 dark:bg-primary/20 p-4 rounded-3xl mb-6 shadow-sm border border-primary/20">
                    <QrCode className="text-primary dark:text-blue-400 w-10 h-10" />
                </div>

                <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-2">
                    Digital Access Assets
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 w-3/4 mx-auto">
                    Your strictly permanent QR Code and NFC Link. These unique identifiers will remain identical regardless of profile updates.
                </p>

                <div className="flex flex-col items-center justify-center space-y-10">

                    {/* QR Code Container */}
                    {data.qrCodeUrl ? (
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative p-6 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center">
                                <img src={`${import.meta.env.VITE_API_URL}${data.qrCodeUrl}`} alt="Permanent QR Code" className="w-64 h-64 object-contain brightness-100 dark:brightness-200 dark:contrast-200 dark:grayscale dark:invert" />
                                <div className="mt-6 flex items-center justify-center gap-3 w-full">
                                    <button
                                        onClick={handleDownloadPng}
                                        className="flex-1 flex justify-center items-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
                                    >
                                        <Download size={18} /> PNG
                                    </button>
                                    <button
                                        onClick={handleDownloadPdf}
                                        className="flex-1 flex justify-center items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
                                    >
                                        <FileText size={18} /> PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center p-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-slate-400 dark:text-slate-500 w-3/4">
                            <ScanLine size={48} className="mb-4 opacity-50" />
                            <p className="font-semibold text-lg">Asset Not Available</p>
                            <p className="text-sm mt-1">Please contact master administration.</p>
                        </div>
                    )}

                    {/* NFC Link Container */}
                    {/* NFC Link Container */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700 p-4 sm:p-6 rounded-2xl w-full text-left relative overflow-hidden shadow-sm transition-colors">
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-100 dark:from-slate-700/20 to-transparent pointer-events-none hidden sm:block"></div>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="bg-white dark:bg-slate-700/50 p-3 rounded-full shadow-sm shrink-0">
                                <LinkIcon className="text-primary dark:text-blue-400 w-6 h-6" />
                            </div>
                            <div className="flex-1 w-full sm:pr-16 min-w-0">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">Permanent Landing Router (NFC Link)</h4>
                                <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-900/50 border border-blue-200 dark:border-slate-700 rounded-xl px-4 py-3 mt-3 shadow-inner gap-3 sm:gap-0">
                                    <a href={data.nfcUrl} target="_blank" rel="noreferrer" className="text-primary dark:text-blue-400 font-medium hover:underline break-all sm:break-normal">
                                        {data.nfcUrl}
                                    </a>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-slate-400 hover:text-primary dark:hover:text-amber-400 transition-colors sm:ml-4 p-2 focus:outline-none self-end sm:self-auto flex items-center gap-2"
                                        title="Copy URL"
                                    >
                                        <Copy size={18} />
                                        <span className="sm:hidden text-sm font-semibold">Copy</span>
                                    </button>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-4 leading-relaxed bg-white/60 dark:bg-slate-800/80 inline-block px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700">
                                    <span className="text-amber-500 font-bold mr-1">NOTE:</span>
                                    Encode this exact URL directly onto physical NFC cards.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
