import { useState } from 'react';
import { Table, Modal, Form, Input, Select, notification, Tag } from 'antd';
import { useWallet } from '../context/WalletContext';
import { useAlgorand } from '../hooks/useAlgorand';
import { ShieldAlert, Plus, Users, Award, TrendingUp, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NEON_BLUE = 'var(--neon-blue)';
const NEON_PURPLE = 'var(--neon-purple)';
const NEON_GREEN = 'var(--neon-green)';

const StatCard = ({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: string; color: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="rounded-2xl p-6 flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-glass)]"
    >
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[var(--bg-glass)]"
            style={{ border: `1px solid ${color}44` }}
        >
            <div style={{ color }}>{icon}</div>
        </div>
        <div>
            <p className="text-sm font-semibold mb-0.5 text-[var(--text-secondary)] m-0">{label}</p>
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] m-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</h3>
        </div>
    </motion.div>
);

export const AdminDashboard = () => {
    const { wallet } = useWallet();
    const { simulateTransaction, isProcessing } = useAlgorand();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [students, setStudents] = useState([
        { key: '1', name: 'Alex Student', did: 'did:algo:839472983749', department: 'Computer Science', credentials: 1, status: 'verified' },
        { key: '2', name: 'Sarah Connor', did: 'did:algo:192837465091', department: 'Engineering', credentials: 3, status: 'verified' },
        { key: '3', name: 'John Doe', did: 'did:algo:564738291029', department: 'Business', credentials: 0, status: 'pending' },
        { key: '4', name: 'Riya Sharma', did: 'did:algo:748291034856', department: 'Data Science', credentials: 2, status: 'verified' },
        { key: '5', name: 'Marcus Webb', did: 'did:algo:390182746503', department: 'Physics', credentials: 1, status: 'verified' },
    ]);

    const handleIssue = async (values: any) => {
        const res = await simulateTransaction(`Issue ${values.type} Credential`);
        if (res.success) {
            setStudents(prev => prev.map(s => s.did === values.did ? { ...s, credentials: s.credentials + 1, status: 'verified' } : s));
            notification.success({
                message: '✅ Credential Anchored on Algorand',
                description: `TxID: ${res.txId?.substring(0, 20)}…`,
                placement: 'bottomRight',
                duration: 5,
            });
            setIsModalOpen(false);
            form.resetFields();
        }
    };

    const handleRevoke = async (did: string) => {
        const res = await simulateTransaction(`Revoke credential for ${did}`);
        if (res.success) {
            setStudents(prev => prev.filter(s => s.did !== did));
            notification.warning({
                message: '⚠️ Credential Revoked',
                description: `TxID: ${res.txId?.substring(0, 20)}…`,
                placement: 'bottomRight',
            });
        }
    };

    const columns = [
        {
            title: <span className="text-[var(--text-secondary)]">Student</span>,
            dataIndex: 'name',
            key: 'name',
            render: (name: string, r: any) => (
                <div>
                    <p className="font-bold text-sm text-[var(--text-primary)] m-0">{name}</p>
                    <p className="text-xs font-mono text-[var(--text-secondary)] m-0">{r.did.substring(0, 20)}…</p>
                </div>
            ),
        },
        {
            title: <span className="text-[var(--text-secondary)]">Department</span>,
            dataIndex: 'department',
            key: 'department',
            render: (d: string) => <span className="text-[var(--text-secondary)]">{d}</span>,
        },
        {
            title: <span className="text-[var(--text-secondary)]">Credentials</span>,
            dataIndex: 'credentials',
            key: 'credentials',
            align: 'center' as const,
            render: (n: number) => <span className="text-[var(--text-primary)] font-bold">{n}</span>,
        },
        {
            title: <span className="text-[var(--text-secondary)]">Status</span>,
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => (
                <Tag style={{
                    background: s === 'verified' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.15)',
                    color: s === 'verified' ? NEON_GREEN : '#fbbf24',
                    border: 'none', borderRadius: 999, fontWeight: 700,
                }}>
                    {s.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: <span className="text-[var(--text-secondary)]">Actions</span>,
            key: 'actions',
            render: (_: any, r: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => { form.setFieldsValue({ did: r.did }); setIsModalOpen(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--bg-glass)] cursor-pointer hover:bg-transparent"
                        style={{ color: NEON_BLUE, border: `1px solid ${NEON_BLUE}` }}
                    >
                        Issue
                    </button>
                    <button
                        onClick={() => handleRevoke(r.did)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--bg-glass)] cursor-pointer hover:bg-transparent"
                        style={{ color: '#ef4444', border: '1px solid #ef4444', opacity: isProcessing ? 0.6 : 1 }}
                    >
                        Revoke
                    </button>
                </div>
            ),
        },
    ];

    if (!wallet.isConnected || wallet.role !== 'admin') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <ShieldAlert size={52} className="text-[var(--text-secondary)] opacity-50" />
                <h2 className="text-[var(--text-secondary)] m-0">Admin access required</h2>
                <p className="text-[var(--text-secondary)]">Please connect with the University Admin role via Connect Wallet.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto pb-16"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-extrabold mb-1 text-[var(--text-primary)]"
                        style={{ fontSize: 32, fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}
                    >
                        University Admin Portal
                    </motion.h1>
                    <p className="text-[var(--text-secondary)] m-0">Issue, manage, and revoke student verifiable credentials</p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { form.resetFields(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
                    style={{
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif",
                        boxShadow: 'var(--glow-blue)',
                    }}
                >
                    <Plus size={16} /> Issue Credential
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <StatCard icon={<Users size={24} />} label="Registered DIDs" value="1,248" color={NEON_BLUE} delay={0.1} />
                <StatCard icon={<Award size={24} />} label="Active Credentials" value="4,592" color={NEON_PURPLE} delay={0.2} />
                <StatCard icon={<TrendingUp size={24} />} label="Verifications (Today)" value="317" color={NEON_GREEN} delay={0.3} />
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-glass)]"
            >
                <div className="px-6 py-4 border-b border-[var(--border-glass)]">
                    <h3 className="font-bold text-[var(--text-primary)] m-0">Student Directory</h3>
                </div>
                {/* Notice we pass className to help overriding light/dark styles */}
                <Table
                    columns={columns}
                    dataSource={students}
                    pagination={false}
                    className="custom-table"
                />
            </motion.div>

            {/* Issue Modal */}
            <Modal
                title={<span className="text-[var(--text-primary)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Issue Verifiable Credential</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                className="theme-modal"
            >
                <Form form={form} layout="vertical" onFinish={handleIssue} className="mt-4">
                    <Form.Item name="did" label={<span className="text-[var(--text-primary)]">Student DID</span>} rules={[{ required: true }]}>
                        <Input placeholder="did:algo:…" className="font-mono bg-[var(--bg-glass)] text-[var(--text-primary)] border-[var(--border-glass)]" />
                    </Form.Item>
                    <Form.Item name="type" label={<span className="text-[var(--text-primary)]">Credential Type</span>} rules={[{ required: true }]}>
                        <Select placeholder="Select type…" className="custom-select">
                            <Select.Option value="Library Access">📚 Library Membership</Select.Option>
                            <Select.Option value="Enrollment">🎓 Proof of Enrollment</Select.Option>
                            <Select.Option value="Degree">📜 Degree Certificate</Select.Option>
                            <Select.Option value="Hostel">🏠 Hostel Residency</Select.Option>
                            <Select.Option value="Event">🎪 Event Participation</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="metadata" label={<span className="text-[var(--text-primary)]">Encrypted Metadata</span>}>
                        <Input.TextArea
                            placeholder={'{ "term": "Fall 2026", "validUntil": "2027-01-01" }'}
                            className="font-mono text-xs bg-[var(--bg-glass)] text-[var(--text-primary)] border-[var(--border-glass)]"
                            rows={3}
                        />
                    </Form.Item>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-base text-white mt-2"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            border: 'none',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.7 : 1,
                            fontFamily: "'Space Grotesk', sans-serif",
                        }}
                    >
                        {isProcessing
                            ? (<><Loader size={18} className="animate-spin" /> Anchoring to Algorand…</>)
                            : (<>Sign &amp; Anchor on Algorand <ArrowRight size={18} /></>)
                        }
                    </motion.button>
                </Form>
            </Modal>
        </motion.div>
    );
};
