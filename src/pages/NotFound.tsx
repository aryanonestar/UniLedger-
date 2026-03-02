import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export const NotFound = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
        <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
        >
            <span className="text-5xl font-extrabold" style={{ color: 'var(--neon-purple)', fontFamily: "'Space Grotesk', sans-serif" }}>404</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Page Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md">
            The decentralized identity page you are looking for does not exist or has been removed from the network index.
        </p>
        <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all no-underline"
            style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
        >
            <LayoutDashboard size={18} /> Return to Home
        </Link>
    </motion.div>
);
