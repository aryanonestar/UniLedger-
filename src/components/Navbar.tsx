import { useState } from 'react';
import { Button, Dropdown } from 'antd';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';
import { Wallet, LogOut, LayoutDashboard, UserCircle, Search, Fingerprint, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navbar = () => {
    const { wallet, connect, disconnect } = useWallet();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [scrolled] = useState(false);

    const menuItems = [
        {
            key: 'student',
            label: (
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(79,156,249,0.15)' }}>
                        <UserCircle size={16} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm m-0 text-[var(--text-primary)]">Student</p>
                        <p className="text-xs m-0 text-[var(--text-secondary)]">DID Management</p>
                    </div>
                </div>
            ),
            onClick: () => { connect('student'); navigate('/student'); }
        },
        {
            key: 'admin',
            label: (
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.15)' }}>
                        <LayoutDashboard size={16} className="text-purple-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm m-0 text-[var(--text-primary)]">University Admin</p>
                        <p className="text-xs m-0 text-[var(--text-secondary)]">Issue Credentials</p>
                    </div>
                </div>
            ),
            onClick: () => { connect('admin'); navigate('/admin'); }
        },
        {
            key: 'recruiter',
            label: (
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.15)' }}>
                        <Search size={16} className="text-emerald-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm m-0 text-[var(--text-primary)]">Recruiter / Verifier</p>
                        <p className="text-xs m-0 text-[var(--text-secondary)]">Verify Credentials</p>
                    </div>
                </div>
            ),
            onClick: () => { connect('recruiter'); navigate('/verify'); }
        },
    ];

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full"
            style={{
                background: scrolled
                    ? 'var(--header-bg-solid)'
                    : 'var(--header-bg-trans)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-glass)',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 no-underline group">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
                    >
                        <Fingerprint size={18} color="white" />
                        <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
                    </div>
                    <span
                        className="text-xl font-bold tracking-tight"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        <span className="gradient-text">Uni</span>
                        <span className="text-[var(--text-primary)]">Ledger</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { label: 'Home', path: '/' },
                        ...(wallet.isConnected && wallet.role === 'student' ? [{ label: 'Dashboard', path: '/student' }] : []),
                        ...(wallet.isConnected && wallet.role === 'admin' ? [{ label: 'Admin Portal', path: '/admin' }] : []),
                        ...(wallet.isConnected && (wallet.role === 'recruiter' || wallet.role === 'public') ? [{ label: 'Verify', path: '/verify' }] : []),
                    ].map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {wallet.isConnected ? (
                        <div className="flex items-center gap-3">
                            <div
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                            >
                                <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-400" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                                    {wallet.role}
                                </span>
                                <span className="text-sm font-mono text-[var(--text-primary)]">
                                    {wallet.address?.substring(0, 8)}…{wallet.address?.slice(-4)}
                                </span>
                            </div>
                            <Button
                                danger
                                size="small"
                                icon={<LogOut size={14} />}
                                onClick={disconnect}
                                style={{
                                    background: 'rgba(248,113,113,0.1)',
                                    border: '1px solid rgba(248,113,113,0.3)',
                                    color: '#f87171',
                                    borderRadius: 10,
                                }}
                            >
                                Disconnect
                            </Button>
                        </div>
                    ) : (
                        <Dropdown
                            menu={{
                                items: menuItems,
                                className: "theme-dropdown"
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                type="primary"
                                size="middle"
                                icon={<Wallet size={16} />}
                                className="btn-primary flex items-center gap-2"
                                style={{
                                    height: 40,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    fontWeight: 700,
                                    borderRadius: 12,
                                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(79,156,249,0.3)',
                                }}
                            >
                                Connect Wallet
                            </Button>
                        </Dropdown>
                    )}
                </div>
            </div>
        </motion.header>
    );
};
