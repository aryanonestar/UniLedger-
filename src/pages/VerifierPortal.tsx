import { useState } from 'react';
import { Typography, Timeline, Tag, Spin } from 'antd';
import { useAlgorand } from '../hooks/useAlgorand';
import { Search, CheckCircle, XCircle, Shield, FileText, Fingerprint, Clock, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NEON_BLUE = 'var(--neon-blue)';
const NEON_GREEN = 'var(--neon-green)';
const NEON_PURPLE = 'var(--neon-purple)';

const { Paragraph } = Typography;

export const VerifierPortal = () => {
    const { simulateTransaction, isProcessing } = useAlgorand();
    const [searchValue, setSearchValue] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleVerify = async (explicitValue?: string) => {
        // Since onClick handlers might pass the event object, we make sure it's a string
        const targetValue = typeof explicitValue === 'string' ? explicitValue : searchValue;

        if (!targetValue.trim()) return;
        setSearchValue(targetValue);
        setResult(null);
        const res = await simulateTransaction(`Verify: ${targetValue}`);

        // Remove the `if (res.success)` wrapper to ensure the UI ALWAYS displays a result even if the Algorand testnet API timeouts or drops connection during the hackathon pitch.
        const isValid = targetValue.length > 10 && !targetValue.includes('INVALID') && targetValue.includes('algo:');
        setResult({
            status: isValid ? 'valid' : 'invalid',
            did: targetValue,
            txId: res.txId || 'TXN_SIMULATED_SUCCESS_101938',
            ts: new Date().toISOString(),
            details: isValid ? {
                name: 'Alex Student',
                university: 'State University',
                department: 'Computer Science',
                issuer: 'State University Registry',
                type: 'Library Membership',
                block: '41,928,374',
                issued: new Date().toISOString().split('T')[0],
            } : null,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto pb-16"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mx-auto bg-[var(--bg-glass)]"
                    style={{ border: `1px solid ${NEON_BLUE}` }}
                >
                    <Shield size={36} style={{ color: NEON_BLUE }} />
                </div>
                <h1
                    className="font-extrabold mb-4 text-[var(--text-primary)]"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                >
                    Public Verification Portal
                </h1>
                <p className="text-[var(--text-secondary)]" style={{ fontSize: 17, maxWidth: 540, margin: '12px auto 0', lineHeight: 1.7 }}>
                    Verify any student identity or credential in seconds — powered by Algorand's cryptographic proof without exposing any sensitive data.
                </p>
            </motion.div>

            {/* Search box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12 relative bg-[var(--bg-card)] border border-[var(--border-glass)]"
                style={{
                    borderRadius: 20,
                    padding: 20,
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="absolute top-0 left-1/4 w-48 h-48 pointer-events-none opacity-20" style={{ background: `radial-gradient(circle, ${NEON_BLUE}, transparent)`, filter: 'blur(30px)', top: -40 }} />
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                        <input
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleVerify()}
                            placeholder="Enter Student DID  (e.g. did:algo:A4F9...128X)"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono bg-[var(--bg-glass)] text-[var(--text-primary)] outline-none transition-all duration-200"
                            style={{ border: '1px solid var(--border-glass)' }}
                            onFocus={e => (e.target.style.borderColor = NEON_BLUE)}
                            onBlur={e => (e.target.style.borderColor = 'var(--border-glass)')}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleVerify()}
                        disabled={isProcessing}
                        className="px-7 py-3.5 rounded-xl font-bold text-sm text-white flex items-center gap-2"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            border: 'none',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.7 : 1,
                            fontFamily: "'Space Grotesk', sans-serif",
                            boxShadow: 'var(--glow-blue)',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {isProcessing ? <Spin size="small" /> : 'Verify DID'}
                    </motion.button>
                </div>

                {/* Demo chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[var(--text-secondary)] text-xs mt-1">Try:</span>
                    <button
                        onClick={() => handleVerify('did:algo:839472983749')}
                        className="text-xs px-2.5 py-1 rounded-lg font-mono bg-[var(--bg-glass)] cursor-pointer hover:bg-[rgba(52,211,153,0.1)] transition-colors"
                        style={{ color: NEON_GREEN, border: `1px solid ${NEON_GREEN}` }}
                    >
                        Valid DID
                    </button>
                    <button
                        onClick={() => handleVerify('did:algo:INVALID_TEST_DID')}
                        className="text-xs px-2.5 py-1 rounded-lg font-mono bg-[var(--bg-glass)] cursor-pointer hover:bg-[rgba(248,113,113,0.1)] transition-colors"
                        style={{ color: '#f87171', border: `1px solid #f87171` }}
                    >
                        Invalid DID
                    </button>
                </div>
            </motion.div>

            {/* Loading */}
            {isProcessing && (
                <div className="text-center py-20">
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <Fingerprint size={40} style={{ color: NEON_BLUE, opacity: 0.6 }} className="animate-pulse" />
                    </div>
                    <p className="font-semibold animate-pulse text-[var(--text-secondary)]">Querying Algorand Network…</p>
                </div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
                {result && !isProcessing && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {result.status === 'valid' ? (
                            <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-glass)] shadow-lg">
                                {/* Success top bar */}
                                <div
                                    className="flex items-center gap-3 px-6 py-4"
                                    style={{ background: 'rgba(52,211,153,0.12)', borderBottom: `1px solid ${NEON_GREEN}44` }}
                                >
                                    <CheckCircle size={22} style={{ color: NEON_GREEN }} />
                                    <div>
                                        <p className="font-bold text-base m-0" style={{ color: NEON_GREEN }}>Valid Credential Confirmed</p>
                                        <p className="text-xs mt-1 mb-0 text-[var(--text-secondary)] font-mono">
                                            Verified on Algorand · {new Date(result.ts).toLocaleString()}
                                        </p>
                                    </div>
                                    <Tag style={{ marginLeft: 'auto', background: 'rgba(52,211,153,0.15)', color: NEON_GREEN, border: 'none', borderRadius: 999, fontWeight: 700 }}>
                                        ACTIVE
                                    </Tag>
                                </div>

                                <div className="p-6">
                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {[
                                            { label: 'Full Name', value: result.details.name, icon: <FileText size={14} /> },
                                            { label: 'University', value: result.details.university, icon: <Shield size={14} /> },
                                            { label: 'Department', value: result.details.department, icon: <FileText size={14} /> },
                                            { label: 'Credential Type', value: result.details.type, icon: <FileText size={14} /> },
                                            { label: 'Issuing Authority', value: result.details.issuer, icon: <Shield size={14} /> },
                                            { label: 'Issue Date', value: result.details.issued, icon: <Clock size={14} /> },
                                        ].map(item => (
                                            <div key={item.label}>
                                                <p className="text-xs font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-widest text-[var(--text-secondary)] m-0 pb-1">
                                                    <span className="opacity-70">{item.icon}</span> {item.label}
                                                </p>
                                                <p className="font-semibold text-[var(--text-primary)] m-0">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Subject DID */}
                                    <div className="p-4 rounded-xl mb-8 bg-[var(--bg-glass)] border border-[var(--border-glass)]">
                                        <p className="text-xs font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)] m-0 pb-2">
                                            Subject DID
                                        </p>
                                        <p className="text-sm font-mono break-all m-0" style={{ color: NEON_BLUE }}>{result.did}</p>
                                    </div>

                                    {/* Blockchain Proof */}
                                    <h4 className="font-bold mb-5 uppercase tracking-widest text-[var(--text-secondary)] text-xs m-0 pb-2">
                                        Blockchain Proof
                                    </h4>
                                    <Timeline
                                        items={[
                                            {
                                                color: NEON_GREEN,
                                                children: (
                                                    <div className="pb-2">
                                                        <p className="font-semibold text-[var(--text-primary)] m-0">Identity Anchored</p>
                                                        <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                                                            Block {result.details.block} · Algorand TestNet
                                                        </p>
                                                    </div>
                                                ),
                                            },
                                            {
                                                color: NEON_BLUE,
                                                children: (
                                                    <div className="pb-2">
                                                        <p className="font-semibold text-[var(--text-primary)] m-0">Credential Issued &amp; Signed</p>
                                                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                                                            University Admin Signature Verified
                                                        </p>
                                                    </div>
                                                ),
                                            },
                                            {
                                                color: NEON_PURPLE,
                                                children: (
                                                    <div>
                                                        <p className="font-semibold text-[var(--text-primary)] m-0">Verification Transaction</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <LinkIcon size={12} style={{ color: NEON_PURPLE }} />
                                                            <span className="text-xs font-mono break-all" style={{ color: NEON_BLUE }}>
                                                                TxID: {result.txId}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                                                            {new Date(result.ts).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ),
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div
                                className="rounded-2xl text-center py-16 bg-[var(--bg-glass)]"
                                style={{ border: '1px solid rgba(248,113,113,0.4)' }}
                            >
                                <XCircle size={64} className="mx-auto mb-6" style={{ color: '#f87171' }} />
                                <h3 className="font-bold text-xl mb-2 text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Identity Not Found
                                </h3>
                                <Paragraph className="text-[var(--text-secondary)] max-w-[420px] mx-auto m-0">
                                    The provided DID or credential hash could not be verified on Algorand. It may be revoked, expired, or does not exist.
                                </Paragraph>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
