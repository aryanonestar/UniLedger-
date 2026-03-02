import React, { createContext, useContext, useState } from 'react';

export type Role = 'student' | 'admin' | 'service' | 'recruiter' | 'public';

interface WalletState {
    isConnected: boolean;
    address: string | null;
    role: Role;
    did: string | null;
}

interface WalletContextType {
    wallet: WalletState;
    connect: (role: Role) => void;
    disconnect: () => void;
    setDid: (did: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: null,
        role: 'public',
        did: null,
    });

    const connect = (role: Role) => {
        // Generate a mock Algorand address
        const mockAddress = 'ALGO' + Math.random().toString(36).substring(2, 15).toUpperCase();
        setWallet({
            isConnected: true,
            address: mockAddress,
            role,
            did: null, // DID will be set later in the flow
        });
    };

    const disconnect = () => {
        setWallet({
            isConnected: false,
            address: null,
            role: 'public',
            did: null,
        });
    };

    const setDid = (did: string) => {
        setWallet((prev) => ({ ...prev, did }));
    };

    return (
        <WalletContext.Provider value={{ wallet, connect, disconnect, setDid }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
