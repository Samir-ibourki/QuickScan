# 🛒 QuickScan - Mobile POS System

QuickScan is an innovative, fast, and cost-effective Point of Sale (POS) system that transforms any smartphone into a professional barcode scanner and receipt printer.

![QuickScan Concept](https://img.shields.io/badge/Status-Active-brightgreen.svg)

## 📖 The Story Behind QuickScan

The idea was born out of a simple observation while waiting in a long checkout line at a local supermarket. Small business owners often rely on expensive, outdated, and clunky POS hardware. Yet, almost everyone carries a high-powered computer with an amazing camera right in their pocket—their smartphone.

*What if we turned that smartphone into a lightning-fast POS system?*

QuickScan bridges the gap between modern mobile technology and legacy hardware, providing an affordable and highly efficient solution for everyday businesses.

## 🚀 Features

- **📱 Instant Mobile Scanning**: Uses the smartphone's camera to instantly read barcodes (EAN-13, EAN-8, etc.) without the need for dedicated hardware.
- **🛒 Smart Cart Management**: Real-time product lookup, quantity adjustment, and automatic total calculations.
- **🖨️ Physical Receipt Printing**: Seamlessly connects to physical Windows thermal printers (like WD8260) over the local network to print professional ESC/POS formatted receipts instantly.
- **⚡ Fast & Reliable**: Built with modern architectures including TanStack React Query for solid state management and caching.

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native (with Expo)
- **Scanning Engine**: `expo-camera`
- **State Management & Data Fetching**: TanStack React Query & Axios
- **Styling**: Premium Dark Theme UI with native components and React Native Vector Icons.

### Backend (Local Server)
- **Environment**: Node.js & Express.js
- **Printing Logic**: `node-thermal-printer` executing raw Windows printing (`copy /b`) to bypass driver limitations and send raw ESC/POS binary codes directly to the printer spooler.
- **Data**: JSON Mock Database for fast local product lookups.

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js installed on your PC.
- A physical thermal printer connected via USB to your Windows PC and **shared** on the network with the share name `POS80`.
- Expo Go installed on your smartphone.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   pnpm install
   ```
2. Start the local server:
   ```bash
   pnpm run dev
   ```

### 3. Frontend Setup
1. Find your PC's local IPv4 address (run `ipconfig` in CMD, e.g., `192.168.8.11`).
2. Update the `SERVER_IP` constant in `frontend/api/config.js` with your IP address.
3. Open a new terminal, navigate to the `frontend` folder, and start the Expo app:
   ```bash
   cd frontend
   pnpm install
   pnpm expo start
   ```
4. Scan the generated QR code using the Expo Go app on your phone.

## 🤝 Contribution

Contributions are always welcome! Feel free to open an issue or submit a pull request if you have ideas on how to improve the code.
