
const SERVER_IP = "192.168.8.11"; 
const SERVER_PORT = 5000;

export const API_BASE = `http://${SERVER_IP}:${SERVER_PORT}`;

export const ENDPOINTS = {
  PRODUCT: (barcode) => `${API_BASE}/product/${barcode}`,
  PRINT: `${API_BASE}/print`,
};
