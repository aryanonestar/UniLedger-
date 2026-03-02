import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageBubble, type ChatMessage } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { sendChatMessage } from '../../services/aiChatService';

interface ChatWindowProps {
    onClose: () => void;
}

const QUICK_QUESTIONS = [
    "What is Algorand?",
    "What is DID?",
    "How do I verify a student?",
    "Why blockchain for identity?"
];

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: '1',
        sender: 'bot',
        text: 'Hi there! I am AlgoGuide, your AI assistant for the UniLedger identity platform. Ask me anything about Algorand, decentralized identity, or verification!',
        timestamp: new Date()
    }]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newUserMsg]);
        setIsTyping(true);

        const replyText = await sendChatMessage(text);

        const newBotMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: replyText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newBotMsg]);
        setIsTyping(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] z-50 overflow-hidden backdrop-blur-3xl"
            style={{ boxShadow: '0 25px 50px -12px rgba(37,99,235,0.25)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-md">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm m-0">AlgoGuide AI</h3>
                        <p className="text-xs text-blue-100 m-0 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all border-none bg-transparent"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-card)] custom-scrollbar">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-600 text-white shadow-[var(--glow-blue)]">
                            <Bot size={16} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-bl-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}

                {/* Quick questions (only show if few messages to save space) */}
                {messages.length < 3 && !isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1">
                            <Sparkles size={12} className="text-indigo-400" />
                            Suggested Questions
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_QUESTIONS.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full hover:bg-blue-500 hover:text-white cursor-pointer transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input fixed at bottom */}
            <ChatInput onSendMessage={handleSend} disabled={isTyping} />
        </motion.div>
    );
};
