import { useState, useEffect } from 'react';
import algosdk from 'algosdk';
import { Buffer } from 'buffer';

// Connect to Algorand TestNet via public Algonode endpoint
const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

export const useAlgorand = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [networkStatus, setNetworkStatus] = useState<string>('Connecting...');

    useEffect(() => {
        algodClient.status().do()
            .then((status: any) => {
                setNetworkStatus(`Connected to TestNet (Block: ${status['last-round']})`);
            })
            .catch(() => setNetworkStatus('TestNet Connection Failed'));
    }, []);

    // Simulates Algorand SDK usage by fetching real network params and creating a real signed transaction
    const simulateTransaction = async (actionDesc: string) => {
        setIsProcessing(true);
        try {
            console.log(`[Algorand] Initiating: ${actionDesc}`);

            // 1. Fetch live network parameters from TestNet
            const suggestedParams = await algodClient.getTransactionParams().do();
            console.log('[Algorand] Live suggested params:', suggestedParams);

            // 2. Generate an ephemeral account just for the demo transaction
            const demoAccount = algosdk.generateAccount();

            // 3. Create a real Algorand transaction (0 ALGO payment to self with note)
            const noteText = `UniLedger: ${actionDesc}`;
            const note = new Uint8Array(Buffer.from(noteText));

            const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: demoAccount.addr,
                to: demoAccount.addr,
                amount: 0,
                note: note,
                suggestedParams: suggestedParams
            } as any);

            // 4. Sign the transaction
            const signedTxn = txn.signTxn(demoAccount.sk);
            console.log(`[Algorand] Signed bytes length: ${signedTxn.length}`);

            // Generate a real txId
            const txId = txn.txID().toString();
            console.log(`[Algorand] Signed Tx. ID: ${txId}`);

            // To actually broadcast, we would need ALGO in the demoAccount.
            // Since we don't, we simulate the network delay of broadcasting.
            await new Promise(resolve => setTimeout(resolve, 1500));

            return {
                success: true,
                txId: txId,
                message: `${actionDesc} signed and prepared. (Simulated broadcast due to 0 balance)`,
                details: {
                    fee: (suggestedParams as any).fee,
                    firstRound: (suggestedParams as any).firstValid || (suggestedParams as any).firstRound,
                    lastRound: (suggestedParams as any).lastValid || (suggestedParams as any).lastRound,
                    network: 'TestNet'
                }
            };
        } catch (e: any) {
            console.error('[Algorand] Error:', e);
            // Fallback to offline mock instantly so the hackathon demo NEVER breaks
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                success: true,
                txId: `MOCK_TX_${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
                message: `${actionDesc} executed in offline demo mode.`,
                details: {
                    fee: 1000,
                    firstRound: 41928374,
                    lastRound: 41929374,
                    network: 'Offline Fallback'
                }
            };
        } finally {
            setIsProcessing(false);
        }
    };

    const generateDID = () => {
        // Generate a real Algorand public address safely
        try {
            const account = algosdk.generateAccount();
            return `did:algo:${account.addr}`;
        } catch (e) {
            console.error('[Algorand] Offline mock DID active');
            return `did:algo:MOCK_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
        }
    };

    return { simulateTransaction, isProcessing, generateDID, networkStatus };
};
