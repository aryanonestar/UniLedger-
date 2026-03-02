import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Activity, Zap, ArrowRight, Lock, Globe, Cpu, ChevronDown } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const NEON_BLUE = 'var(--neon-blue)';
const NEON_PURPLE = 'var(--neon-purple)';
const NEON_CYAN = 'var(--neon-cyan)';
const NEON_GREEN = 'var(--neon-green)';

/* ────────── Particles (Optimized) ────────── */
// Reduced from 30 to 15 particles, lower opacity for better performance
const Particles = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 15 }).map((_, i) => {
            const size = Math.random() * 3 + 1;
            const delay = Math.random() * 6;
            const dur = Math.random() * 8 + 6;
            const x = Math.random() * 100;
            // Native hex colors for raw particles to bypass var overhead during transform
            const colors = ['#4f9cf9', '#a78bfa', '#22d3ee', '#34d399'];
            const color = colors[i % colors.length];
            return (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{ width: size, height: size, left: `${x}%`, background: color, opacity: 0.2 }}
                    animate={{ y: ['-10vh', '110vh'], opacity: [0, 0.4, 0] }}
                    transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
                />
            );
        })}
    </div>
);

/* ────────── Stat Badge ────────── */
const StatBadge = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div
        className="flex flex-col items-center px-6 py-4 rounded-2xl"
        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
    >
        <span className="text-3xl font-extrabold" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
        </span>
        <span className="text-xs font-semibold mt-1" style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {label}
        </span>
    </div>
);

/* ────────── Feature Card ────────── */
const FeatureCard = ({
    icon, title, description, color, delay,
}: {
    icon: React.ReactNode; title: string; description: string; color: string; delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -6 }}
        className="p-6 flex flex-col gap-4 rounded-2xl cursor-default transition-all duration-300"
        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
    >
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--bg-primary)]"
            style={{ border: `1px solid ${color}44` }} // using semi-transparent border based on the color string
        >
            <div style={{ color }}>{icon}</div>
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
    </motion.div>
);

/* ────────── Workflow Step ────────── */
const WorkflowStep = ({
    number, title, description, color, delay,
}: {
    number: string; title: string; description: string; color: string; delay: number;
}) => (
    <motion.div
        className="flex flex-col items-center text-center gap-4 relative bg-[var(--bg-glass)] p-6 rounded-2xl border border-[var(--border-glass)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        style={{ zIndex: 2 }}
    >
        <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold relative bg-[var(--bg-primary)]"
            style={{ border: `2px solid ${color}`, color, fontFamily: "'Space Grotesk', sans-serif" }}
        >
            {number}
            <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ borderColor: color }} />
        </div>
        <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)', margin: 0 }}>{title}</h4>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', margin: 0 }}>{description}</p>
    </motion.div>
);

/* ────────── FAQ Item ────────── */
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-[var(--border-glass)] rounded-xl mb-4 bg-[var(--bg-glass)] overflow-hidden transition-all duration-300 hover:border-[var(--neon-blue)]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-5 flex justify-between items-center bg-transparent border-none cursor-pointer focus:outline-none"
            >
                <span className="font-semibold text-[var(--text-primary)] text-base">{question}</span>
                <ChevronDown size={20} className={`text-[var(--text-secondary)] transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-5 text-[var(--text-secondary)] leading-relaxed text-sm">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ══════════════ LANDING PAGE ══════════════ */
export const Landing = () => {
    const { connect, wallet } = useWallet();
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]); // Smoother transform

    const handleGetStarted = () => {
        if (!wallet.isConnected) connect('student');
        navigate('/student');
    };

    const features = [
        { icon: <ShieldCheck size={26} />, title: 'Tamper-Proof Ledger', description: 'Credentials cryptographically anchored on Algorand’s immutable ledger — impossible to forge, destroy, or alter.', color: NEON_BLUE },
        { icon: <Fingerprint size={26} />, title: 'Self-Sovereign Identity', description: 'You own your DID. Share only what’s needed via selective disclosure — no central authority required.', color: NEON_PURPLE },
        { icon: <Zap size={26} />, title: 'Sub-Second Finality', description: 'Algorand finalizes blocks in under 3 seconds with pure PoS, giving instant, irreversible confirmation for credentials.', color: NEON_CYAN },
        { icon: <Activity size={26} />, title: 'Transparent Audit', description: 'Full public log of credential issuance and revocation — readable by anyone without exposing private PII data.', color: NEON_GREEN },
        { icon: <Lock size={26} />, title: 'Privacy by Design', description: 'Identity hashes stored on-chain. Raw PII stays off-chain and encrypted. Zero Knowledge proofs roadmapped.', color: '#f472b6' },
        { icon: <Globe size={26} />, title: 'Cross-Institution Access', description: 'One Algorand DID works across campuses, libraries, hostels, labs, clubs, and international recruiters.', color: '#fbbf24' },
    ];

    const workflowSteps = [
        { number: '01', title: 'Local Key Generation', description: 'Student creates an Algorand ED25519 keypair securely in the browser. No central database.', color: NEON_BLUE },
        { number: '02', title: 'On-Chain Anchoring', description: 'The public DID is anchored to the Algorand TestNet via a 0-ALGO transaction with notes payload.', color: NEON_PURPLE },
        { number: '03', title: 'University Issuance', description: 'Admin cryptographically signs and issues a verifiable credential linked directly to the Student DID.', color: NEON_CYAN },
        { number: '04', title: 'Universal Verification', description: 'Any recruiter can verify the signed bytes instantly against the Algorand blockchain.', color: NEON_GREEN },
    ];

    const faqs = [
        { question: 'Why Algorand instead of Ethereum or Polygon?', answer: 'Algorand offers Pure Proof of Stake (PPoS) ensuring immediate transaction finality in under 3.3 seconds without the risk of forking. For a campus identity system handling thousands of daily library trips and exam verifications, sub-second finality and predictable micro-cent gas fees are strictly mandatory.' },
        { question: 'Are student records public on the blockchain?', answer: 'No. Only cryptographic hashes and Decentralized Identifiers (DIDs) are stored on the public ledger. Actual Personally Identifiable Information (PII) like names and grades are kept entirely off-chain. The blockchain merely acts as the ultimate truth anchor.' },
        { question: 'How do users pay for transaction fees?', answer: 'In this hackathon architecture, a central relayer or University treasury would cover the 0.001 ALGO minimum fee for anchoring DIDs, ensuring the end-student does not need to install wallets or buy crypto directly to use the campus services.' },
        { question: 'How is the Smart Contract structured?', answer: 'We utilize an Algorand Smart Contract (Teal) alongside standardized ARC interfaces. However, for maximum efficiency, many verifications occur via lightweight offline signature checking against anchored network keys, scaling massively.' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative pb-24"
            style={{ overflow: 'hidden' }}
        >
            <Particles />

            {/* ── Giant blurred glows ── */}
            <div className="absolute pointer-events-none" style={{ top: '-10%', left: '5%', width: 700, height: 700, background: 'radial-gradient(circle, var(--border-glow) 0%, transparent 65%)', zIndex: 0 }} />
            <div className="absolute pointer-events-none" style={{ top: '30%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, var(--glow-purple) 0%, transparent 65%)', zIndex: 0 }} />

            {/* ━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━ */}
            <div ref={heroRef} className="relative" style={{ zIndex: 1 }}>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[88vh] py-12">

                    {/* Left: Copy */}
                    <motion.div style={{ y: heroY }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                                style={{
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--neon-blue)',
                                    color: NEON_BLUE,
                                    fontWeight: 600,
                                    fontSize: 13,
                                }}
                            >
                                <Cpu size={14} />
                                🚀 Algorand Hackathon 2026 Core Project
                            </motion.div>

                            {/* Headline */}
                            <h1
                                className="font-extrabold leading-tight mb-6 text-[var(--text-primary)]"
                                style={{
                                    fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                                    lineHeight: 1.05,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    letterSpacing: '-0.02em',
                                    margin: 0,
                                }}
                            >
                                Decentralized<br />
                                <span className="gradient-text" style={{ paddingBottom: '0.1em' }}>Campus Identity</span><br />
                                <span className="text-[var(--text-secondary)]" style={{ fontSize: '75%' }}>Protocol</span>
                            </h1>

                            {/* Sub */}
                            <p
                                className="mb-8 max-w-xl text-[var(--text-secondary)]"
                                style={{ fontSize: 18, lineHeight: 1.7, margin: '0 0 32px' }}
                            >
                                Powered natively by <strong>Algorand TestNet</strong>. Students own a tamper-proof DID. Universities issue verifiable credentials. Campus services verify instantly — no central database, no forgery.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4 mb-10">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleGetStarted}
                                    className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-base text-white w-full sm:w-auto"
                                    style={{
                                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                        boxShadow: 'var(--glow-blue)',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Get Started as Student <ArrowRight size={18} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => { connect('admin'); navigate('/admin'); }}
                                    className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-base text-[var(--text-primary)] w-full sm:w-auto bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                >
                                    University Admin
                                </motion.button>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4">
                                <StatBadge label="Algorand Accounts" value="1,248" color={NEON_BLUE} />
                                <StatBadge label="Credentials Anchored" value="4,592" color={NEON_PURPLE} />
                                <StatBadge label="Avg Tx Speed" value="3.1s" color={NEON_GREEN} />
                            </div>

                            {/* Additional Tag Link */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8"
                            >
                                <a
                                    href="https://campus-guardian-ai-123.web.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-wrap items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 bg-[var(--bg-glass)] border border-[var(--neon-purple)]"
                                    style={{
                                        color: NEON_PURPLE,
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 14px -5px var(--neon-purple)',
                                    }}
                                >
                                    <Globe size={16} />
                                    REGISTER NEW USER/ADMIN/CAMPUS/RECURITER AND ANALYTICS
                                </a>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Floating ID Card */}
                    <div className="relative flex items-center justify-center mt-12 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 40, rotateY: 15 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 80 }}
                            className="animate-float-slow w-full max-w-md relative"
                            style={{ perspective: 1000, zIndex: 10 }}
                        >
                            {/* ID Card */}
                            <div
                                className="relative rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--neon-blue)]"
                                style={{
                                    boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
                                    padding: '32px',
                                    backdropFilter: 'blur(24px)'
                                }}
                            >
                                {/* Transparent gradient overlay */}
                                <div className="absolute inset-0 opacity-10" style={{
                                    background: `linear-gradient(135deg, ${NEON_BLUE} 0%, transparent 50%, ${NEON_PURPLE} 100%)`,
                                }} />

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-6 relative">
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: NEON_BLUE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                            State University
                                        </p>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] m-0">Alex Student</h3>
                                        <p className="text-xs mt-1 text-[var(--text-secondary)] font-mono">
                                            did:algo:V2I8...K9Q0
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-glass)]"
                                        style={{ border: `1px solid ${NEON_BLUE}44` }}
                                    >
                                        <Fingerprint size={22} style={{ color: NEON_BLUE }} />
                                    </div>
                                </div>

                                {/* Details grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6 relative">
                                    {[
                                        { label: 'Department', value: 'Computer Science' },
                                        { label: 'Year', value: '3rd Year' },
                                        { label: 'Network', value: 'Algorand TestNet' },
                                        { label: 'Status', value: '✅ Algorand Verified' },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <p className="text-[11px] mb-0.5 text-[var(--text-secondary)] uppercase tracking-wider">
                                                {item.label}
                                            </p>
                                            <p className="text-sm font-semibold text-[var(--text-primary)] m-0">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div
                                    className="flex justify-between items-center pt-5 relative border-t border-[var(--border-glass)]"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: NEON_GREEN }} />
                                            <span className="text-xs font-bold" style={{ color: NEON_GREEN }}>Identity Active</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] m-0 font-mono">
                                            Block: 61,038,542
                                        </p>
                                    </div>
                                    <div
                                        className="w-16 h-16 p-2 rounded-xl bg-white flex items-center justify-center"
                                    >
                                        <QRCodeSVG value="did:algo:V2I8K9Q0" size={48} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating status badges */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                            className="absolute -right-4 top-16 px-4 py-2.5 rounded-xl flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--neon-green)] shadow-lg backdrop-blur-md"
                            style={{ zIndex: 12 }}
                        >
                            <ShieldCheck size={16} style={{ color: NEON_GREEN }} />
                            <span className="text-sm font-bold text-[var(--text-primary)]">Anchored Identity ✓</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                            className="absolute -left-4 bottom-16 px-4 py-2.5 rounded-xl flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--neon-blue)] shadow-lg backdrop-blur-md"
                            style={{ zIndex: 12 }}
                        >
                            <Zap size={16} style={{ color: NEON_BLUE }} />
                            <span className="text-sm font-bold text-[var(--text-primary)]">Algorand Confirmed</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ FEATURES ━━━━━━━━━━━━━━━━━━ */}
            <section className="py-24 relative max-w-7xl mx-auto px-6" style={{ zIndex: 1 }}>
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <p className="text-xs font-bold mb-3" style={{ color: NEON_PURPLE, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                            Core Capabilities
                        </p>
                        <h2
                            className="font-extrabold mb-4 text-[var(--text-primary)]"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                        >
                            Why <span className="gradient-text">Algorand?</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mt-3">
                            Pure PoS. Carbon-negative. Sub-second finality. Algorand is the precise infrastructure needed to handle massive scale campus identity verification securely.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.1} />)}
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━ BLOCKCHAIN WORKFLOW DIAGRAM ━━━━━━━━━━━━━━━━━━ */}
            <section className="py-24 relative bg-[var(--bg-glass)] border-y border-[var(--border-glass)]" style={{ zIndex: 1 }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <p className="text-xs font-bold mb-3" style={{ color: NEON_BLUE, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                The Technical Flow
                            </p>
                            <h2
                                className="font-extrabold mb-4 text-[var(--text-primary)]"
                                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                            >
                                How UniLedger Integrates Web3
                            </h2>
                            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mt-3">
                                From algorithmic local key generation to verifiable on-chain anchoring, here is the architecture operating under the hood.
                            </p>
                        </motion.div>
                    </div>

                    <div className="relative">
                        {/* Desktop Connector line */}
                        <div
                            className="absolute hidden lg:block"
                            style={{ top: '30%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(79,156,249,0.3), rgba(167,139,250,0.3), transparent)' }}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {workflowSteps.map((s, i) => <WorkflowStep key={i} {...s} delay={i * 0.15} />)}
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━ FAQ SECTION ━━━━━━━━━━━━━━━━━━ */}
            <section className="py-24 relative max-w-4xl mx-auto px-6" style={{ zIndex: 1 }}>
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <p className="text-xs font-bold mb-3 uppercase tracking-widest text-[#f472b6]">
                            Developer FAQ
                        </p>
                        <h2
                            className="font-extrabold mb-10 text-[var(--text-primary)]"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                        >
                            Project Integration Details
                        </h2>
                    </motion.div>
                </div>

                <div className="w-full">
                    {faqs.map((faq, idx) => (
                        <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </section>

            {/* ━━━━━━━━━━━━━━━━━━ CTA STRIP ━━━━━━━━━━━━━━━━━━ */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative py-16 mt-12 mx-6 rounded-3xl overflow-hidden max-w-7xl xl:mx-auto"
                style={{
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(109,40,217,0.1) 100%)',
                    border: '1px solid var(--border-glow)',
                    zIndex: 1,
                }}
            >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(79,156,249,0.05) 0%, transparent 70%)' }} />
                <div className="text-center relative px-4">
                    <h2
                        className="font-extrabold mb-4 text-[var(--text-primary)]"
                        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                    >
                        Ready for the Algorand Demo?
                    </h2>
                    <p className="mb-8 text-[var(--text-secondary)]" style={{ fontSize: 18, margin: '12px auto 28px' }}>
                        Connect to the TestNet and experience transparent identity anchoring.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGetStarted}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white"
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                boxShadow: 'var(--glow-blue)',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                        >
                            Student Login <ArrowRight size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { connect('recruiter'); navigate('/verify'); }}
                            className="px-8 py-4 rounded-xl font-bold text-base text-[var(--text-primary)]"
                            style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-glass)',
                                cursor: 'pointer',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                        >
                            Verify a Credential
                        </motion.button>
                    </div>
                </div>
            </motion.section>

            {/* ━━━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━━━ */}
            <footer className="mt-24 text-center py-8 relative" style={{ zIndex: 1, borderTop: '1px solid var(--border-glass)' }}>
                <p className="text-[var(--text-secondary)] text-sm font-medium">
                    Made with <span className="text-red-500">❤️</span> by Team <span className="gradient-text font-bold">Algomind Trinity</span>
                </p>
                <p className="mt-2 text-xs opacity-50 text-[var(--text-secondary)]">2026 Hackathon Submission Project</p>
            </footer>
        </motion.div>
    );
};
