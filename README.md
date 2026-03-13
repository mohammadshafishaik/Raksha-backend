# 🛡️ Raksha — Safety App (Monorepo)

> **Your Safety, Our Priority.** A real-time personal safety app for Android and iOS.

This repository contains the **complete Raksha application** — both the Express.js backend API and the React Native (Expo) mobile frontend.

---

## 📁 Repository Structure

```
Raksha-backend/          ← root = Node.js/Express backend
├── config/              ← Database connection
├── middleware/          ← JWT auth middleware
├── models/              ← Mongoose models (User, DangerZone, Incident)
├── routes/              ← API route handlers
│   ├── user.js          ← Register, login, profile
│   ├── safety.js        ← Location, SOS, trusted contacts
│   ├── dangerZones.js   ← Danger zone management
│   ├── notifications.js ← Expo push token registration
│   └── incidents.js     ← Incident reporting (new)
├── server.js            ← Express entry point
├── .env.example         ← Environment variable template
│
└── frontend/            ← React Native / Expo frontend
    ├── screens/
    │   ├── RegisterScreen.js
    │   ├── LoginScreen.js
    │   ├── DashBoardScreen.js  ← Map, SOS, trusted contacts
    │   ├── ProfileScreen.js    ← View & edit profile (new)
    │   └── ReportIncidentScreen.js  ← Report incidents (new)
    ├── components/
    │   ├── Button.js
    │   ├── GlassCard.js
    │   └── input.js
    ├── utils/
    │   ├── api.js          ← Central API helper
    │   └── osmPlaces.js    ← OpenStreetMap nearby places
    ├── App.js
    ├── index.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS simulator

---

### 1. Clone the repository

```bash
git clone https://github.com/mohammadshafishaik/Raksha-backend.git
cd Raksha-backend
```

---

### 2. Configure the backend

```bash
# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/raksha
JWT_SECRET=your_super_secret_key
PORT=5000
```

---

### 3. Start the backend

```bash
npm install
npm start
```

The API will be available at `http://localhost:5000`.

---

### 4. Configure and start the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` with your backend URL:
```env
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.12:5000
```
> Replace `192.168.1.12` with your computer's local IP address when testing on a physical device.
> For production, use the deployed URL (e.g. `https://raksha-backend-und2.onrender.com`).

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.

---

## 🔌 API Endpoints

### Auth (`/api/users`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/register` | Register a new user | — |
| POST | `/login` | Login and receive JWT | — |
| GET | `/profile` | Get logged-in user's profile | ✅ |
| PUT | `/profile` | Update name / phone | ✅ |

### Safety (`/api/safety`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| PUT | `/location` | Update real-time location | ✅ |
| POST | `/sos` | Trigger SOS alert | ✅ |
| GET | `/trusted-contacts` | List trusted contacts | ✅ |
| POST | `/trusted-contacts` | Add trusted contact | ✅ |
| PUT | `/trusted-contacts/:id` | Update trusted contact | ✅ |
| DELETE | `/trusted-contacts/:id` | Delete trusted contact | ✅ |

### Danger Zones (`/api/dangerzones`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/` | List all active danger zones | ✅ |
| POST | `/add-test-zone` | Add a test danger zone | ✅ |

### Incidents (`/api/incidents`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/` | Report a new incident | ✅ |
| GET | `/` | Get my reported incidents | ✅ |
| GET | `/recent` | Get recent community incidents | ✅ |
| DELETE | `/:id` | Delete my incident | ✅ |

### Notifications (`/api/notifications`)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/token` | Register Expo push token | ✅ |

---

## ✨ Features

- **User Registration & Login** with hashed passwords and JWT authentication
- **Real-time Location Tracking** with foreground and background updates
- **Interactive Map** (OpenStreetMap) with nearby police, hospitals, fire stations, pharmacies
- **Danger Zone Overlay** — visual polygon warnings on the map
- **SOS Panic Button** — instantly alerts trusted contacts with your location
- **Push Notifications** — receive alerts even when the app is in the background
- **Trusted Contacts Management** — add, edit, delete emergency contacts
- **Incident Reporting** — report harassment, theft, accidents and other incidents
- **User Profile** — view and update your name and phone number

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Frontend | React Native, Expo |
| Maps | react-native-maps + OpenStreetMap |
| Notifications | Expo Notifications |

---

## 📄 License

ISC
