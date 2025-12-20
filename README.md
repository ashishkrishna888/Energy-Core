# Energy Core - Smart Resource Conservation System

A Full Stack (MERN) web application for monitoring and controlling home appliances to conserve **Energy** and **Water**. Built with modern technologies and real-time database integration.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**Energy Core** is a comprehensive smart home dashboard that enables users to:

- **Monitor** real-time energy (kW) and water (L/min) consumption
- **Control** connected appliances remotely (ON/OFF, Eco Mode)
- **Track** historical usage patterns with interactive charts
- **Set** conservation goals and receive visual feedback
- **Predict** monthly electricity bills based on current usage
- **Simulate** water leak scenarios for emergency preparedness

The system uses **real database integration** - all charts, device states, and settings are persisted in MongoDB, making it a production-ready full-stack application.

---

## ✨ Features

### 🔌 Device Management (Full CRUD)
- **Create**: Add new energy or water devices
- **Read**: View all connected appliances with real-time status
- **Update**: Toggle devices ON/OFF, enable Eco Mode
- **Delete**: Remove devices from the system

### 📊 Real-Time Analytics
- **Energy Charts**: 7-day historical energy usage (kWh) from database
- **Water Charts**: 7-day historical water consumption (Liters) from database
- **Conservation Monitor**: Visual indicators (Red/Green) when usage exceeds limits
- **Bill Predictor**: Calculate estimated monthly costs based on current load

### ⚙️ User Settings
- **Persistent Limits**: Energy and Water conservation goals saved to database
- **Instant UI**: Sliders update immediately while dragging
- **Auto-Save**: Settings persist on page refresh

### 💧 Water System Demo
- **Leak Detection Simulation**: Visual alert system for abnormal water flow
- **Real-Time Monitoring**: Track water usage patterns

### 🔐 Security
- **JWT Authentication**: Secure token-based user sessions
- **Password Hashing**: bcryptjs with salt rounds
- **Protected Routes**: All device/energy/settings endpoints require authentication

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI framework with Hooks
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 3.4.18** - Utility-first styling
- **Recharts 3.5.1** - Data visualization library
- **React Router DOM 7.10.1** - Client-side routing
- **Axios 1.13.2** - HTTP client with interceptors
- **Lucide React 0.561.0** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.21.1** - Web framework
- **MongoDB** - NoSQL database (MongoDB Atlas or Local)
- **Mongoose 8.8.0** - ODM for MongoDB
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

---

## 📁 Project Structure

```
Energy-Core/
├── client/
│   └── client/
│       ├── src/
│       │   ├── api/           # API client configuration
│       │   ├── components/    # Reusable React components
│       │   ├── context/       # Auth context provider
│       │   ├── layouts/      # Page layouts
│       │   └── pages/        # Main page components
│       ├── package.json
│       └── .env              # Frontend environment variables
│
├── server/
│   └── src/
│       ├── config/           # Database configuration
│       ├── controllers/      # Business logic
│       ├── middleware/       # Auth middleware
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API route definitions
│       ├── seed/             # Database seeding scripts
│       ├── utils/            # Helper functions
│       ├── app.js            # Express app setup
│       └── server.js         # Server entry point
│   ├── package.json
│   └── .env                  # Backend environment variables
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (MongoDB Atlas account or local MongoDB installation)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Energy-Core
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client/client
npm install
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_energy_mvp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

**Required Variables:**
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string (Atlas or local)
- `JWT_SECRET` - Secret key for JWT token signing
- `NODE_ENV` - Environment mode (development/production)

### Frontend (`client/client/.env`)
Create a `.env` file in the `client/client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Required Variables:**
- `VITE_API_BASE_URL` - Backend API base URL

---

## 🏃 Quick Start

### 1. Start the Backend Server
```bash
cd server
npm run dev    # Development mode with nodemon
# OR
npm start      # Production mode
```

The server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd client/client
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Seed Initial Data (Optional)
To populate the database with sample devices and historical data:

```bash
cd server

# Seed default devices (5 devices)
npm run seed:devices

# Seed 7 days of historical data
npm run seed:history
```

### 4. Access the Application
1. Open `http://localhost:5173` in your browser
2. **Register** a new account or **Login** with existing credentials
3. Navigate to the **Dashboard** to start monitoring

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### Device Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/devices` | Get all user devices | ✅ |
| `GET` | `/api/devices/:id` | Get device by ID | ✅ |
| `POST` | `/api/devices` | Create new device | ✅ |
| `DELETE` | `/api/devices/:id` | Delete device | ✅ |
| `PATCH` | `/api/devices/:id/toggle` | Toggle device ON/OFF | ✅ |
| `PATCH` | `/api/devices/:id/eco` | Toggle Eco Mode | ✅ |
| `POST` | `/api/devices/seed` | Seed default devices | ✅ |
| `GET` | `/api/devices/history/water` | Get water usage history | ✅ |

### Energy Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/energy/history?range=daily` | Get energy history (daily/weekly) | ✅ |

### Settings Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/settings` | Get user settings | ✅ |
| `PATCH` | `/api/settings` | Update user settings | ✅ |

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/dashboard/summary` | Get dashboard summary | ✅ |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health` | Server health check | ❌ |

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  role: String (enum: ['user', 'admin'])
}
```

### Device Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String (required),
  type: String (enum: ['energy', 'water']),
  consumption: Number (kW for energy, L/min for water),
  isOn: Boolean,
  isEco: Boolean,
  category: String (enum: ['HVAC', 'LIGHTING', 'WATER_HEATER', 'OTHER']),
  location: String,
  currentPowerKw: Number (calculated),
  timestamps: true
}
```

### EnergyLog Model
```javascript
{
  userId: ObjectId (ref: User),
  deviceId: ObjectId (ref: Device),
  timestamp: Date,
  powerKw: Number,
  energyKwh: Number,
  day: String ("YYYY-MM-DD"),
  week: String ("YYYY-Wxx")
}
```

### WaterLog Model
```javascript
{
  userId: ObjectId (ref: User),
  deviceId: ObjectId (ref: Device),
  timestamp: Date,
  flowRateLpm: Number,
  totalLiters: Number,
  day: String ("YYYY-MM-DD"),
  week: String ("YYYY-Wxx")
}
```

### Settings Model
```javascript
{
  userId: ObjectId (ref: User, unique),
  energyLimit: Number (default: 15, min: 5, max: 50),
  waterLimit: Number (default: 100, min: 50, max: 200)
}
```

---

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for mobile devices. The viewport meta tag is configured in `client/client/index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## 🎨 Key Features in Detail

### Conservation Monitor
- **Red/Green Logic**: Charts automatically color-code bars based on conservation limits
- **Real-Time Updates**: Charts refresh when devices are toggled
- **Dual Resource View**: Toggle between Energy (kWh) and Water (Liters) views

### Bill Predictor
- **Real-Time Calculation**: Uses current device load (kW) × 24 hours × 30 days × rate
- **Localized Currency**: Default set to Indian Rupee (₹) with configurable rate
- **Instant Updates**: Recalculates when devices are toggled or rate is changed

### Device Control
- **iOS-Style Toggles**: Modern switch UI for device control
- **Eco Mode**: Reduce consumption by 20% when enabled
- **Real-Time Status**: Shows current consumption rate (kW or L/min)

---

## 🔧 Available Scripts

### Backend (`server/`)
```bash
npm run dev          # Start development server (nodemon)
npm start            # Start production server
npm run seed:devices # Seed default devices
npm run seed:history # Seed 7 days of historical data
npm run clear:history # Clear all history logs
```

### Frontend (`client/client/`)
```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🐛 Troubleshooting

### "Request failed with status code 500" Error
This usually means the backend server encountered an error. Check the following:

1. **Missing `.env` file**: 
   - Create a `.env` file in the `server/` directory
   - Add required variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
   - See [Environment Variables](#-environment-variables) section above

2. **MongoDB Connection**:
   - Ensure MongoDB is running (local) or Atlas connection string is correct
   - Check server console for MongoDB connection errors

3. **JWT Secret Missing**:
   - If `JWT_SECRET` is not set, authentication will fail
   - Generate a secure key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **Check Server Logs**:
   - Look at the server console output for detailed error messages
   - The improved error handling now logs full error stacks

### MongoDB Connection Issues
- **Local MongoDB**: Ensure MongoDB service is running (`mongod`)
- **MongoDB Atlas**: Verify connection string in `.env` and network access settings
- Check `server/src/config/db.js` for detailed error messages

### Port Already in Use
- **Backend (5000)**: Change `PORT` in `server/.env` or kill the process using port 5000
- **Frontend (5173)**: Vite will automatically use the next available port

### CORS Errors
- Ensure backend CORS is enabled (already configured in `server/src/app.js`)
- Verify `VITE_API_BASE_URL` matches your backend URL

### Device Toggle Not Working
- Check server console for error messages
- Verify `.env` file exists and has all required variables
- Ensure MongoDB is connected and accessible
- Check that user is authenticated (JWT token is valid)

---

## 📝 License

This project is created for educational purposes (University Final Project).

---

## 👥 Authors

- **Development Team** - Energy Core Project

---

## 🙏 Acknowledgments

- Built with modern MERN stack best practices
- UI inspired by production SaaS dashboards
- Charts powered by Recharts library

---

**Version:** 1.0.0  
**Last Updated:** December 2025
