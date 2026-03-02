import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (msg: string) => void;
    disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-3 bg-[var(--bg-card)] border-t border-[var(--border-glass)]"
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask AlgoGuide..."
                disabled={disabled}
                className="flex-1 bg-[var(--bg-glass)] text-sm px-4 py-2.5 rounded-xl border border-[var(--border-glass)] focus:outline-none focus:border-[var(--neon-blue)] transition-colors text-[var(--text-primary)]"
            />
            <button
                type="submit"
                disabled={!inputValue.trim() || disabled}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95 border-none cursor-pointer"
            >
                <Send size={16} />
            </button>
        </form>
    );
};
