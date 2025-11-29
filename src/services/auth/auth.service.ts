import axios from 'axios';

const API_URL = 'http://localhost:5004/api/auth';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Đăng ký
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng nhập
  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
  }
};