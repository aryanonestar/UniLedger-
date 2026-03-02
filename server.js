import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_if_none');

const PREDEFINED_ANSWERS = [
    {
        keywords: ['what is algorand', 'explain algorand', 'algorand', 'why algorand'],
        answer: "Algorand is a high-performance, purely proof-of-stake blockchain designed for fast, secure, and decentralized applications. It provides the immutable layer for our university identity platform to ensure tamper-proof credentials."
    },
    {
        keywords: ['what is did', 'did', 'decentralized identity', 'what is a decentralized identity'],
        answer: "A Decentralized Identifier (DID) is a unique digital identity stored on the Algorand blockchain that allows students to securely control and share their credentials without relying on a central authority."
    },
    {
        keywords: ['verify', 'recruiter', 'how can recruiters', 'how do recruiters'],
        answer: "Recruiters use our Public Verification Portal. By inputting a student's DID, the platform queries the Algorand blockchain to instantly verify the cryptographic signature and validity of the credentials."
    },
    {
        keywords: ['blockchain', 'fraud', 'prevent fraud', 'blockchain transparency'],
        answer: "Blockchain ensures immutability. Once a credential is significantly issued and anchored on Algorand, it cannot be forged or tampered with, preventing identity fraud."
    },
    {
        keywords: ['wallet login', 'how does wallet login work', 'how does login work'],
        answer: "Wallet login links your identity to a cryptographic key pair instead of a simple password. This ensures only you can access and share your Decentralized Identity securely."
    },
    {
        keywords: ['show my did', 'explain my verification', 'how do i share', 'verification status'],
        answer: "Please navigate to your 'Student Dashboard' to view your active DID, view your exact verification status, and use the 'Share Proof' mechanism."
    }
];

app.post('/api/ai-chat', async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage) return res.status(400).json({ reply: 'Message is required.' });

        const lowerMsg = userMessage.toLowerCase();
        const matched = PREDEFINED_ANSWERS.find(item =>
            item.keywords.some(k => lowerMsg.includes(k))
        );

        if (matched) {
            // Simulate real-ish delay so it feels chatty
            await new Promise(r => setTimeout(r, 600));
            return res.json({ reply: matched.answer });
        }

        if (!process.env.GEMINI_API_KEY) {
            await new Promise(r => setTimeout(r, 600));
            return res.json({ reply: "I'm sorry, I am currently running without a Google Gemini API key. Please configure the environment variable to ask me out-of-the-box questions!" });
        }

        // Otherwise, ask Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are "AlgoGuide AI", a friendly and modern chatbot assistant working on an Algorand-based decentralized identity platform.
    Help users understand Algorand, decentralized identities (DID), and credential verification.
    Rules: Keep your answers short (2-3 sentences max), modern, friendly, and web3-oriented.
    NEVER hallucinate technical claims or APIs. Do not say you can perform actions like revoking or verifying yourself, tell them to use the dashboard.

    User's question: "${userMessage}"`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ reply: 'Sorry, my neural pathways encountered a block. Please try again!' });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`AlgoGuide AI backend running on port ${PORT}`));
