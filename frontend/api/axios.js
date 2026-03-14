import axios from "axios";
import { API_BASE } from "./config";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export const posService = {
  getProduct: async (barcode) => {
    const { data } = await apiClient.get(`/product/${barcode}`);
    return { ...data, barcode };
  },
  
  printReceipt: async ({ items, total }) => {
    const { data } = await apiClient.post("/print", { items, total });
    return data;
  },
};

export default apiClient;
