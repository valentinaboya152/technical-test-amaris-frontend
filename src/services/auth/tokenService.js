const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Helper function to validate token format
const isValidToken = (token) => {
  if (!token) return false;
  // A valid JWT should have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

export const tokenService = {
  getAccessToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    // Ensure the token is properly formatted
    if (token && !token.startsWith('Bearer ')) {
      return `Bearer ${token}`;
    }
    return token;
  },

  setAccessToken(token) {
    if (!token) {
      console.error('Attempted to set an empty access token');
      return;
    }
    // Store without 'Bearer ' prefix
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    if (!isValidToken(cleanToken)) {
      console.error('Invalid token format');
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, cleanToken);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token) {
    if (!token) {
      console.error('Attempted to set an empty refresh token');
      return;
    }
    if (!isValidToken(token)) {
      console.error('Invalid refresh token format');
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    // Check if token is expired (only if it's a JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        return payload.exp * 1000 > Date.now();
      }
    } catch (e) {
      console.error('Error parsing token:', e);
      return false;
    }
    
    return true;
  }
};

export default tokenService;
