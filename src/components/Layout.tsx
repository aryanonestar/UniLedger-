import { Layout as AntLayout } from 'antd';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

const { Content, Footer } = AntLayout;

export const Layout = () => {
    return (
        <AntLayout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Navbar />
            <Content style={{ position: 'relative', zIndex: 1 }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                    background: 'transparent',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    color: '#475569',
                    padding: '20px 0',
                }}
            >
                UniLedger © 2026 — Decentralized Campus Identity · Powered by{' '}
                <span style={{ color: '#4f9cf9', fontWeight: 600 }}>Algorand</span>
            </Footer>
        </AntLayout>
    );
};
