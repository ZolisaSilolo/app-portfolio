const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Simple fingerprint generation
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Browser fingerprint', 2, 2);
  return canvas.toDataURL().slice(-16);
}

// Auth service
export const authService = {
  async getGuestToken(): Promise<string> {
    const fingerprint = generateFingerprint();
    
    const response = await fetch(`${API_BASE_URL}/auth/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fingerprint }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.data.accessToken;
  },
};

export const chatService = {
  async sendMessage(message: string): Promise<string> {
    try {
      // Get auth token first
      const token = await authService.getGuestToken();
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
