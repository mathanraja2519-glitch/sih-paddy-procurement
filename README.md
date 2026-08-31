# 🌾 Smart Mandi Procurement & Real-Time Queue Management Platform
### Ministry of Consumer Affairs, Food & Public Distribution (DoCA)
**Smart India Hackathon 2026 | Problem Statement ID: 26032**  
*Category: Software | Theme: Smart Automation*

---

## 📌 Executive Summary

Smallholder farmers across India face systemic challenges during MSP procurement at Mandis: **unpredictable waiting times (often 12–36 hours in tractor queues), congested yard roads, lack of visibility into slot capacities, and anxiety over crop moisture testing and payment status**.

This platform delivers an automated, end-to-end digital token and queue management system with:
1. **Dynamic Slot Booking & Capacity Throttling**: Regulates daily influx into 2-hour time windows.
2. **Honest, Dynamic Queue Wait-Time Estimation**: Calculates real-time wait duration based on verified vehicles ahead in the Mandi and live processing rates (not static or fake numbers).
3. **5-Stage Live Status Lifecycle**:
   - `Slot Booked` ➔ `Arrived at Mandi` ➔ `Quality Check` ➔ `Procured & Weighed` ➔ `Payment Credited (DBT)`
4. **Real-Time Synchronous Updates**: Staff actions update the farmer's tracking screen in real time with automated SMS simulation.
5. **Bilingual Accessibility (English & Hindi)**: Large touch targets, simple language, and high contrast designed for rural accessibility.
6. **Non-Smartphone / Offline Support**: Integrated IVR voice call simulation, 2-way SMS booking syntax (`BOOK <MANDI> <CROP> <QTY>` to `56070`), and Gram Panchayat Common Service Centre (CSC) workflow.

---

## 🏗️ Project Architecture

```
procurement-platform/
├── backend/                  # Node.js + Express REST API
│   ├── data/
│   │   └── store.js          # In-memory DB-ready store (Centres, Slots, Bookings, SMS logs)
│   ├── routes/
│   │   ├── bookings.js       # Booking CRUD, queue metrics, status advancement
│   │   └── centres.js        # Centre lookups, live capacity, stats
│   ├── server.js             # Express server entry point
│   └── package.json
├── frontend/                 # React + Vite Single Page App (Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── FarmerPortal.jsx     # Registration, slot picker, live queue tracker & SMS feed
│   │   │   ├── StaffDashboard.jsx   # Mandi staff management, queue control, quality & DBT
│   │   │   └── IVRFallbackModal.jsx # Toll-free IVR voice booking and SMS simulation
│   │   ├── api.js            # API client connecting to backend
│   │   ├── i18n.js           # Comprehensive English/Hindi dictionaries
│   │   ├── App.jsx           # Root container with view & language switcher
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md                 # Complete documentation & run guide
```

---

## ⚡ Quick Start & Run Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### Step 1: Start the Backend API Server

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
npm start
```
> The API server will start on **`http://localhost:5000`**.  
> Health check: `http://localhost:5000/api/health`

---

### Step 2: Start the Frontend Application

Open a second terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
> The React + Vite client will start on **`http://localhost:5173`**.

---

## 🖥️ Live Demonstration Guide

To test the **real-time queue management** end-to-end:

1. Open `http://localhost:5173` in your browser.
2. In **Window A (Farmer Portal)**:
   - Click on the **"Live Queue & Token Tracker"** tab.
   - Enter or click demo token **`DOCA-KRN-104`** (Farmer: *Suresh Chandra Yadav*).
   - Observe the current status: `Arrived at Mandi`, Queue Position: `1`, Estimated Wait: `~10 mins`.
3. In **Window B (Staff Dashboard)**:
   - Switch the top switcher to **"Mandi Staff Dashboard"**.
   - Locate **`DOCA-KRN-104`** in the queue table.
   - Click **"Start Quality Check"** ➔ enter moisture (e.g. `11.4%`) and click *Approve*.
   - Click **"Complete Procurement"** ➔ verify weight and click *Confirm*.
   - Click **"Disburse DBT Payment"** ➔ enter UTR reference and click *Authorize*.
4. **Observe Window A**:
   - Within 3 seconds, Window A automatically advances across the timeline without any page reload!
   - The **Simulated SMS Feed** in Window A displays the real-time SMS alerts received at each stage.
5. **Test IVR Booking**:
   - Click **"Offline Helpline / IVR"** in the top header.
   - Click **"Simulate Toll-Free IVR Call Booking"**.
   - A new digital token is created via automated voice simulation and loaded directly into the tracker.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/centres` | List all procurement centres & accepted crops |
| `GET` | `/api/centres/:id/slots?date=YYYY-MM-DD` | Get slots with live remaining capacity |
| `GET` | `/api/centres/:id/stats?date=YYYY-MM-DD` | Get queue statistics for Mandi dashboard |
| `GET` | `/api/crops` | List supported crops and MSP rates |
| `GET` | `/api/bookings` | List/filter bookings (centreId, date, status, search) |
| `GET` | `/api/bookings/:token` | Get booking with dynamic queue position, wait time & SMS log |
| `POST` | `/api/bookings` | Register farmer & book slot (returns digital token) |
| `PATCH` | `/api/bookings/:id/status` | Advance lifecycle status (`SLOT_BOOKED` ➔ `PAYMENT_CREDITED`) |
| `POST` | `/api/bookings/ivr-simulate` | Simulate IVR voice call booking |

---

## 🧮 Queue Wait-Time Algorithm

$$\text{Active Vehicles Ahead} = \sum \text{Bookings in ARRIVED or QUALITY\_CHECK ahead of farmer}$$

$$\text{Estimated Wait Time} = \text{Active Vehicles Ahead} \times \text{Mandi Avg Processing Time (e.g., 10 mins)}$$

This eliminates arbitrary static numbers and provides an honest, reliable arrival time for rural farmers.
