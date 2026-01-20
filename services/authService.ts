
// Simple mock auth service for the CMS
// In a production environment, this should validate against a backend API

const SESSION_KEY = 'nexus_admin_session';

export const authService = {
  login: (password: string): boolean => {
    // Hardcoded password for demonstration. 
    // In a real app, use environment variables or backend validation.
    if (password === 'admin123') {
      localStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    return false;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(SESSION_KEY) === 'true';
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    // Force reload to clear any sensitive states if necessary
    window.location.href = '/'; 
  }
};
