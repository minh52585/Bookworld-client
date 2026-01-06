import axios from 'axios';
import { API_BASE_URL } from '../configs/api';

export interface IValidateDiscountRequest {
  code: string;
  items?: Array<{ product_id: string; price: number; quantity: number }>;
  subtotal?: number;
}

export const validateDiscount = async (payload: IValidateDiscountRequest, token?: string) => {
  return axios.post(`${API_BASE_URL}/discounts/validate`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export default { validateDiscount };
