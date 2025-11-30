// src/services/auth/tokenService.js
const ACCESS_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const isValidToken = (token) => {
  return token && typeof token === 'string' && token.length > 10;
};

export const tokenService = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token) {
    if (!token) {
      console.error('Attempted to set an empty access token');
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token) {
    if (!token) {
      console.error('Attempted to set an empty refresh token');
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  }
};