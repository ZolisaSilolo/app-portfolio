const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const chatService = {
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.data.response;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },
};

export const portfolioService = {
  async getProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Portfolio API error:', error);
      throw error;
    }
  },
};
