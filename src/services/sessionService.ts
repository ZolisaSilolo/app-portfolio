const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ih7tek9ql6.execute-api.us-east-1.amazonaws.com/prod';

interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  isAdmin: boolean;
  expiresAt: string;
}

interface AnalyticsEvent {
  eventType: string;
  userId: string;
  metadata?: Record<string, any>;
}

class SessionService {
  private sessionId: string | null = null;

  async createSession(userId: string, email: string, isAdmin: boolean): Promise<SessionData> {
    const response = await fetch(`${API_BASE_URL}/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        isAdmin,
        userAgent: navigator.userAgent,
        ipAddress: await this.getClientIP()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    this.sessionId = data.sessionId;
    
    // Store session ID locally for quick access
    localStorage.setItem('portfolio_session_id', data.sessionId);
    
    return data;
  }

  async validateSession(sessionId?: string): Promise<SessionData | null> {
    const id = sessionId || this.sessionId || localStorage.getItem('portfolio_session_id');
    
    if (!id) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/session/validate?sessionId=${id}`);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.valid) {
        this.sessionId = id;
        return {
          sessionId: id,
          userId: data.userId,
          email: data.email,
          isAdmin: data.isAdmin,
          expiresAt: data.expiresAt
        };
      }
      
      return null;
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  async updateSession(updates: Record<string, any>): Promise<void> {
    if (!this.sessionId) return;

    await fetch(`${API_BASE_URL}/session/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: this.sessionId,
        updates: {
          ...updates,
          lastActivity: new Date().toISOString()
        }
      })
    });
  }

  async deleteSession(): Promise<void> {
    if (!this.sessionId) return;

    await fetch(`${API_BASE_URL}/session/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: this.sessionId
      })
    });

    this.sessionId = null;
    localStorage.removeItem('portfolio_session_id');
  }

  async logAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/session/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Analytics logging error:', error);
    }
  }

  // Analytics helper methods
  async trackPageView(page: string): Promise<void> {
    await this.logAnalytics({
      eventType: 'page_view',
      userId: this.getCurrentUserId(),
      metadata: { page, referrer: document.referrer }
    });
  }

  async trackChatMessage(messageLength: number): Promise<void> {
    await this.logAnalytics({
      eventType: 'chat_message',
      userId: this.getCurrentUserId(),
      metadata: { messageLength }
    });
  }

  async trackBlogView(blogId: string): Promise<void> {
    await this.logAnalytics({
      eventType: 'blog_view',
      userId: this.getCurrentUserId(),
      metadata: { blogId }
    });
  }

  async trackAdminAction(action: string, details?: Record<string, any>): Promise<void> {
    await this.logAnalytics({
      eventType: 'admin_action',
      userId: this.getCurrentUserId(),
      metadata: { action, ...details }
    });
  }

  private getCurrentUserId(): string {
    // Get from current session or generate anonymous ID
    return this.sessionId || this.getAnonymousId();
  }

  private getAnonymousId(): string {
    let anonymousId = localStorage.getItem('portfolio_anonymous_id');
    if (!anonymousId) {
      anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('portfolio_anonymous_id', anonymousId);
    }
    return anonymousId;
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  // Session management helpers
  getSessionId(): string | null {
    return this.sessionId;
  }

  isSessionActive(): boolean {
    return !!this.sessionId;
  }
}

export const sessionService = new SessionService();
