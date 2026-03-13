# 🛡️ Raksha — Safety App (Monorepo)

> **Your Safety, Our Priority.** A real-time personal safety app for Android and iOS.

This repository contains the **complete Raksha application** — both the Express.js backend API and the React Native (Expo) mobile frontend in one place.

---

## 📂 How to Access & Open the Complete Project

You have **four easy options** — pick whichever suits you best:

### Option 1 — Browse on GitHub (no install needed)

Open the repository in your browser and click any file to read it:

🔗 **[https://github.com/mohammadshafishaik/Raksha-backend](https://github.com/mohammadshafishaik/Raksha-backend)**

Switch to the merged branch that contains both frontend and backend:

```
Branch: copilot/merge-backend-and-frontend
```

Or go directly to the branch URL:  
🔗 **[https://github.com/mohammadshafishaik/Raksha-backend/tree/copilot/merge-backend-and-frontend](https://github.com/mohammadshafishaik/Raksha-backend/tree/copilot/merge-backend-and-frontend)**

---

### Option 2 — Open instantly in GitHub Codespaces (browser-based VS Code)

No installation required. GitHub hosts a full VS Code environment in the cloud:

1. Go to 🔗 [https://github.com/mohammadshafishaik/Raksha-backend](https://github.com/mohammadshafishaik/Raksha-backend)
2. Click the green **`< > Code`** button
3. Click the **`Codespaces`** tab
4. Click **`Create codespace on copilot/merge-backend-and-frontend`**

A full VS Code editor opens in your browser with all files ready. ✅

---

### Option 3 — Open locally in VS Code

```bash
# 1. Clone the repository
git clone https://github.com/mohammadshafishaik/Raksha-backend.git
cd Raksha-backend

# 2. Switch to the merged branch
git checkout copilot/merge-backend-and-frontend

# 3. Open the entire project in VS Code
code .
```

VS Code will show the full file tree in the left sidebar. ✅

---

### Option 4 — Open in Gitpod (another free browser IDE)

Click this button to open the project instantly in Gitpod:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/mohammadshafishaik/Raksha-backend)

---

## 🗺️ Quick File Map — Click to Open Any File on GitHub

> All links below go to the `copilot/merge-backend-and-frontend` branch.

### 🖥️ Backend (Node.js / Express)

| File | What it does | GitHub Link |
|------|-------------|-------------|
| `server.js` | App entry point, middleware setup | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/server.js) |
| `config/db.js` | MongoDB connection | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/config/db.js) |
| `middleware/auth.js` | JWT authentication middleware | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/middleware/auth.js) |
| `models/User.js` | User schema | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/models/User.js) |
| `models/DangerZone.js` | Danger zone schema | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/models/DangerZone.js) |
| `models/Incident.js` | Incident report schema | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/models/Incident.js) |
| `routes/user.js` | Register, login, profile | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/routes/user.js) |
| `routes/safety.js` | Location, SOS, trusted contacts | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/routes/safety.js) |
| `routes/dangerZones.js` | Danger zone management | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/routes/dangerZones.js) |
| `routes/notifications.js` | Expo push token | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/routes/notifications.js) |
| `routes/incidents.js` | Incident reporting | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/routes/incidents.js) |
| `.env.example` | Environment variable template | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/.env.example) |

### 📱 Frontend (React Native / Expo) — inside `frontend/`

| File | What it does | GitHub Link |
|------|-------------|-------------|
| `frontend/App.js` | Navigation root | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/App.js) |
| `frontend/index.js` | Expo entry point | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/index.js) |
| `frontend/app.json` | Expo config | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/app.json) |
| `frontend/package.json` | Frontend dependencies | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/package.json) |
| `frontend/screens/RegisterScreen.js` | User registration screen | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/screens/RegisterScreen.js) |
| `frontend/screens/LoginScreen.js` | Login screen | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/screens/LoginScreen.js) |
| `frontend/screens/DashBoardScreen.js` | Map, SOS, contacts | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/screens/DashBoardScreen.js) |
| `frontend/screens/ProfileScreen.js` | View & edit profile | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/screens/ProfileScreen.js) |
| `frontend/screens/ReportIncidentScreen.js` | Report an incident | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/screens/ReportIncidentScreen.js) |
| `frontend/components/Button.js` | Reusable button | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/components/Button.js) |
| `frontend/components/GlassCard.js` | Card UI component | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/components/GlassCard.js) |
| `frontend/components/input.js` | Text input component | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/components/input.js) |
| `frontend/utils/api.js` | Central API fetch helper | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/utils/api.js) |
| `frontend/utils/osmPlaces.js` | OpenStreetMap nearby places | [open ↗](https://github.com/mohammadshafishaik/Raksha-backend/blob/copilot/merge-backend-and-frontend/frontend/utils/osmPlaces.js) |

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
│   └── incidents.js     ← Incident reporting
├── server.js            ← Express entry point
├── .env.example         ← Environment variable template
│
└── frontend/            ← React Native / Expo frontend
    ├── screens/
    │   ├── RegisterScreen.js
    │   ├── LoginScreen.js
    │   ├── DashBoardScreen.js      ← Map, SOS, trusted contacts
    │   ├── ProfileScreen.js        ← View & edit profile
    │   └── ReportIncidentScreen.js ← Report incidents
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
