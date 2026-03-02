import { useState, useEffect } from 'react';
import { Steps, notification, Tooltip, Tag } from 'antd';
import { useWallet } from '../context/WalletContext';
import { useAlgorand } from '../hooks/useAlgorand';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ShieldCheck, Download, ArrowRight, Fingerprint, Loader, Activity, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NEON_BLUE = 'var(--neon-blue)';
const NEON_PURPLE = 'var(--neon-purple)';
const NEON_GREEN = 'var(--neon-green)';

const MOCK_CREDENTIALS = [
    { id: 'cred-001', type: 'Library Membership', issuer: 'State University Library', issued: '2026-01-15', status: 'active', icon: '📚', color: NEON_BLUE },
    { id: 'cred-002', type: 'Proof of Enrollment', issuer: 'Academic Registrar Office', issued: '2026-01-10', status: 'active', icon: '🎓', color: NEON_PURPLE },
    { id: 'cred-003', type: 'Hostel Residency', issuer: 'Housing Department', issued: '2025-08-01', status: 'active', icon: '🏠', color: NEON_GREEN },
];

const ACTIVITY = [
    { label: 'Identity Created', sub: 'Anchored on Algorand TestNet', hash: 'F3A8...B1D2', color: NEON_BLUE, icon: <Fingerprint size={14} /> },
    { label: 'Library Credential Issued', sub: 'Signed by University Admin', hash: 'A91C...7F4E', color: NEON_PURPLE, icon: <Award size={14} /> },
    { label: 'Credential Shared', sub: 'Sent to Library Service', hash: 'D047...C503', color: NEON_GREEN, icon: <Activity size={14} /> },
];

export const StudentDashboard = () => {
    const { wallet, setDid } = useWallet();
    const { simulateTransaction, isProcessing, generateDID, networkStatus } = useAlgorand();
    const [activeTab, setActiveTab] = useState<'credentials' | 'history'>('credentials');
    const [progress, setProgress] = useState(0);
    const [txHash, setTxHash] = useState('');

    useEffect(() => {
        if (wallet.did) setProgress(3);
    }, [wallet.did]);

    const handleCreateDID = async () => {
        setProgress(1);
        const res = await simulateTransaction('Create DID');
        if (res.success && res.txId) {
            setProgress(2);
            const newDid = generateDID();
            setTxHash(res.txId);
            notification.success({
                message: '🎉 Identity Anchored on Algorand!',
                description: `TxID: ${res.txId.substring(0, 20)}…`,
                placement: 'bottomRight',
                duration: 5,
            });
            setTimeout(() => { setDid(newDid); setProgress(3); }, 900);
        }
    };

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        notification.success({ message: 'Copied to clipboard!', placement: 'top', duration: 2 });
    };

    if (!wallet.isConnected) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <ShieldCheck size={52} className="text-[var(--text-secondary)] opacity-50" />
                <h2 className="text-[var(--text-secondary)] m-0">Connect as Student to continue</h2>
            </motion.div>
        );
    }

    const trustScore = wallet.did ? 98 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto pb-16"
        >
            {/* Page Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-extrabold mb-1 text-[var(--text-primary)]"
                        style={{ fontSize: 32, fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                    >
                        Student Dashboard
                    </motion.h1>
                    <p className="m-0 text-[var(--text-secondary)]">Manage your decentralized campus identity on Algorand</p>
                </div>
                {wallet.did && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl"
                        style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}
                    >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: NEON_GREEN }} />
                        <span className="text-sm font-bold" style={{ color: NEON_GREEN }}>Identity Verified</span>
                        <Tag style={{ background: 'rgba(52,211,153,0.15)', color: NEON_GREEN, border: 'none', borderRadius: 999, fontWeight: 700 }}>
                            {networkStatus || 'Connected'}
                        </Tag>
                    </motion.div>
                )}
            </div>

            {/* ── ONBOARDING FLOW ── */}
            {!wallet.did ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl p-10 max-w-2xl mx-auto text-center"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[var(--bg-glass)]"
                        style={{ border: `1px solid ${NEON_BLUE}` }}
                    >
                        <Fingerprint size={38} style={{ color: NEON_BLUE }} />
                    </div>

                    <h2 className="font-extrabold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, margin: 0 }}>
                        Create Your Web3 Identity
                    </h2>
                    <p className="mb-8 text-[var(--text-secondary)]" style={{ lineHeight: 1.7, margin: '12px 0 32px' }}>
                        Anchor your student profile to the Algorand blockchain. This generates a Decentralized Identifier (DID) that only you control — forever.
                    </p>

                    <Steps
                        current={progress}
                        className="mb-10 text-left custom-steps"
                        items={[
                            { title: <span className="text-[var(--text-primary)] font-medium">Connect Wallet</span>, description: <span className="text-[var(--text-secondary)] text-xs">Authenticate</span> },
                            { title: <span className="text-[var(--text-primary)] font-medium">Generate Keys</span>, description: <span className="text-[var(--text-secondary)] text-xs">Create DID</span> },
                            { title: <span className="text-[var(--text-primary)] font-medium">Anchor on Chain</span>, description: <span className="text-[var(--text-secondary)] text-xs">Algorand TX</span> },
                        ]}
                    />

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCreateDID}
                        disabled={isProcessing}
                        className="flex items-center gap-3 px-8 py-4 mx-auto rounded-xl font-bold text-base text-white"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            border: 'none',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.7 : 1,
                            fontFamily: "'Space Grotesk', sans-serif",
                            boxShadow: 'var(--glow-blue)',
                        }}
                    >
                        {isProcessing
                            ? (<><Loader size={18} className="animate-spin" /> Anchoring to Blockchain…</>)
                            : (<>Generate &amp; Anchor Identity <ArrowRight size={18} /></>)
                        }
                    </motion.button>
                </motion.div>
            ) : (
                /* ── MAIN DASHBOARD ── */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Digital ID Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl overflow-hidden relative"
                            style={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                padding: 24,
                            }}
                        >
                            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.15), transparent 60%)' }} />
                            <div className="relative">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <p className="text-xs font-bold mb-1 uppercase tracking-widest text-[#cbd5e1]">
                                            Decentralized ID
                                        </p>
                                        <h3 className="font-bold text-xl text-white m-0">Alex Student</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg">
                                        <QRCodeSVG value={wallet.did} size={40} />
                                    </div>
                                </div>

                                <div
                                    className="flex items-center gap-2 p-2.5 rounded-xl mb-5 bg-black/20"
                                >
                                    <span className="text-xs font-mono flex-1 truncate text-white/90">
                                        {wallet.did}
                                    </span>
                                    <Tooltip title="Copy DID">
                                        <button onClick={() => copy(wallet.did!)} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer transition-colors">
                                            <Copy size={14} />
                                        </button>
                                    </Tooltip>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                                    <div>
                                        <p className="text-[10px] mb-0.5 uppercase tracking-widest text-white/60">University</p>
                                        <p className="text-sm font-semibold text-white m-0">State University</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] mb-0.5 uppercase tracking-widest text-white/60">Department</p>
                                        <p className="text-sm font-semibold text-white m-0">CS</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Trust Score */}
                        <div
                            className="rounded-2xl p-6 bg-[var(--bg-card)] border border-[var(--border-glass)]"
                        >
                            <h4 className="font-bold mb-6 text-sm text-[var(--text-secondary)] uppercase tracking-widest m-0 pb-5">
                                Trust Score
                            </h4>
                            <div className="text-center">
                                <div className="relative inline-flex items-center justify-center w-24 h-24">
                                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                                        <circle cx="48" cy="48" r="40" fill="none" className="stroke-[var(--border-glass)]" strokeWidth="8" />
                                        <circle cx="48" cy="48" r="40" fill="none"
                                            stroke="url(#trustGrad)" strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(trustScore / 100) * 251.2} 251.2`}
                                            className="transition-all duration-1000"
                                        />
                                        <defs>
                                            <linearGradient id="trustGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={NEON_BLUE} />
                                                <stop offset="100%" stopColor={NEON_GREEN} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-extrabold text-[var(--text-primary)] leading-[1]">{trustScore}</span>
                                        <span className="text-xs text-[var(--text-secondary)]">/100</span>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm font-semibold" style={{ color: NEON_GREEN }}>Strong Identity</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            {[
                                { label: 'Download PDF ID Card', icon: <Download size={16} /> },
                                { label: 'Configure Privacy', icon: <ShieldCheck size={16} /> },
                            ].map(a => (
                                <button
                                    key={a.label}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-left bg-[var(--bg-glass)] text-[var(--text-secondary)] border border-[var(--border-glass)] transition-all duration-200 hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)] cursor-pointer"
                                >
                                    <span style={{ color: 'inherit' }}>{a.icon}</span>
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2">
                        <div
                            className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-glass)] min-h-[500px]"
                        >
                            {/* Tabs */}
                            <div className="flex border-b border-[var(--border-glass)]">
                                {[
                                    { key: 'credentials', label: `My Credentials (${MOCK_CREDENTIALS.length})` },
                                    { key: 'history', label: 'Activity History' },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as any)}
                                        className="px-6 py-4 text-sm font-semibold transition-all bg-transparent border-none cursor-pointer mb-[-1px]"
                                        style={{
                                            borderBottom: activeTab === tab.key ? `2px solid ${NEON_BLUE}` : '2px solid transparent',
                                            color: activeTab === tab.key ? NEON_BLUE : 'var(--text-secondary)',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'credentials' && (
                                        <motion.div
                                            key="credentials"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="grid grid-cols-1 gap-4"
                                        >
                                            {MOCK_CREDENTIALS.map((cred, i) => (
                                                <motion.div
                                                    key={cred.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.08 }}
                                                    className="flex items-center justify-between p-4 rounded-xl group cursor-pointer bg-[var(--bg-glass)] border border-[var(--border-glass)] transition-all hover:bg-[var(--bg-card)]"
                                                    style={{ '--hover-color': cred.color } as React.CSSProperties}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = cred.color; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glass)'; }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[var(--bg-glass)]"
                                                            style={{ border: `1px solid ${cred.color}44` }}
                                                        >
                                                            {cred.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-base text-[var(--text-primary)] m-0">{cred.type}</h4>
                                                            <p className="text-xs mt-0.5 text-[var(--text-secondary)] m-0">
                                                                {cred.issuer} · {cred.issued}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Tag style={{ background: `${NEON_GREEN}18`, color: NEON_GREEN, border: 'none', borderRadius: 999, fontWeight: 700 }}>
                                                            Active
                                                        </Tag>
                                                        <button
                                                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all border cursor-pointer hover:opacity-80"
                                                            style={{ background: 'var(--bg-glass)', color: cred.color, borderColor: `${cred.color}55` }}
                                                        >
                                                            Share Proof
                                                        </button>
                                                        <ArrowRight size={16} className="text-[var(--text-secondary)]" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeTab === 'history' && (
                                        <motion.div
                                            key="history"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="relative pl-6 border-l-2 border-[var(--border-glass)]">
                                                {ACTIVITY.map((a, i) => (
                                                    <div key={i} className="relative mb-8 last:mb-0">
                                                        <div
                                                            className="absolute -left-[31px] top-1 w-4 h-4 rounded-full flex items-center justify-center bg-[var(--bg-primary)]"
                                                            style={{ border: `3px solid ${a.color}`, boxShadow: `0 0 12px ${a.color}66` }}
                                                        />
                                                        <p className="font-semibold mb-0.5 text-[var(--text-primary)] m-0">{a.label}</p>
                                                        <p className="text-xs mb-1 text-[var(--text-secondary)] mt-1">{a.sub}</p>
                                                        <a
                                                            href="#"
                                                            className="inline-flex items-center gap-1 text-xs font-mono no-underline hover:opacity-80"
                                                            style={{ color: a.color }}
                                                        >
                                                            TxHash: {a.hash} ↗
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>

                                            {txHash && (
                                                <div
                                                    className="mt-6 p-4 rounded-xl bg-[var(--bg-glass)] border border-[var(--neon-blue)]"
                                                >
                                                    <p className="text-xs font-bold mb-1 tracking-widest uppercase" style={{ color: NEON_BLUE }}>LATEST TRANSACTION HASH</p>
                                                    <p className="text-xs font-mono break-all text-[var(--text-secondary)] m-0">{txHash}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
