import axios from 'axios';

export const sendChatMessage = async (userMessage: string): Promise<string> => {
    try {
        const response = await axios.post('/api/ai-chat', { userMessage });
        return response.data.reply;
    } catch (error) {
        console.error('Error talking to AlgoGuide:', error);
        return 'Sorry, my server connection seems to be down. Can you try again later?';
    }
};
