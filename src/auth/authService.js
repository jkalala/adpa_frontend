// src/auth/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post(`${API_URL}/auth/logout/`, { refresh: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  refreshAccessToken: async () => {  // 👈 Renamed to avoid conflict
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/auth/token/refresh/`, { 
        refresh: refreshToken 
      });

      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        // Optionally store new refresh token if rotating
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }
        return response.data.access;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await authService.logout();
      return null;
    }
  }
};

export default authService;