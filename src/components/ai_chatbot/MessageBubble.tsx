import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface MessageBubbleProps {
    message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser
                            ? 'bg-blue-600/20 text-blue-500'
                            : 'bg-indigo-600 text-white shadow-[var(--glow-blue)]'
                        }`}
                >
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                    className={`px-4 py-3 rounded-2xl text-sm ${isUser
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-[var(--bg-glass)] text-[var(--text-primary)] border border-[var(--border-glass)] rounded-bl-sm'
                        }`}
                    style={{ lineHeight: 1.5 }}
                >
                    {message.text}
                </div>
            </div>
        </motion.div>
    );
};
