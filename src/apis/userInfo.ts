import axios from 'axios';
import { API_BASE_URL } from '../configs/api';

export const getUserInfo = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/me/infor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserInfo = async (
  token: string,
  data: {
    name?: string;
    email?: string;
    avatar?: string;
    address?: string;
    phone?: string;
  }
) => {
  const response = await axios.put(`${API_BASE_URL}/me/infor`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};