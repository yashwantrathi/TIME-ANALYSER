# ⭐ Time Analyser – README

A modern, minimalist **Time Analyser** web app with signup/login and JSON-file backend storage.
Built with **Node.js + Express** (backend) and **React + Tailwind CSS** (frontend).
**No database required** — all data is stored as JSON files on the server.
**No AI features** — just user auth and the weekly time-analysis dashboard with charts and exports.
**No Java anywhere.**

---

## 📦 Features

* 🔐 **Signup & Login** (hashed passwords + JWT/session)
* 📊 **Weekly Time Analytics**: stacked bar, donut, line trend, heatmap (study, sleep, social media, college, commute, exercise, leisure, other)
* 📁 **JSON File Storage** for users and weekly entries (`data/users.json`, `data/weeks/<userId>.json`)
* 📥 **CSV / JSON export** for user data and weekly reports
* 🌙 **Dark mode** + responsive mobile-first UI with micro-animations
* 🚀 **Runs locally with two commands** (easy for non-devs)

---

## ⚡ Quick Start

Ensure you have **Node.js 18+** installed. Then:

```bash
npm install
npm run dev
```

* Frontend will be served at: [http://localhost:5173](http://localhost:5173)
* Backend API will run at: [http://localhost:3000](http://localhost:3000)

(If ports differ you’ll see them in console on start.)

---

## 📁 Project Structure

```
project/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── entries.js
│   ├── data/
│   │   ├── users.json
│   │   └── weeks/
│   │       └── <userId>.json
│   └── utils/
│       ├── fileHandler.js   # atomic JSON reads/writes
│       └── backup.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/        # API calls (auth, entries, export)
│   │   └── styles/
│   └── index.html
│
└── package.json
```

---

## 🛠️ Available Commands

### Install dependencies

```bash
npm install
```

### Start development mode (frontend + backend)

```bash
npm run dev
```

### Optional helpers

```bash
npm run backend   # start backend only
npm run frontend  # start frontend only
npm run backup    # create timestamped backup of JSON data
```

---

## 🔧 Backend Configuration

Create a `.env` file in project root (optional — defaults exist):

```
PORT=3000
JWT_SECRET=your_secret_here
DATA_DIR=./backend/data/
```

If `.env` is missing, the dev defaults will make the app work locally.

---

## 🔐 Authentication & Security

* Passwords hashed with **bcrypt**; never store plain passwords.
* Auth uses **JWT** tokens. For simple local use the frontend stores token in localStorage.
* Server validates totals (≤24 hours/day) and sanitizes inputs.
* Rate-limiting middleware recommended for production.

---


## 🧭 Design Notes

* UI is modernistic and minimalist: bold accent colors, rounded cards, large spacing.
* Charts: stacked bars (daily per-category), donut (weekly distribution), line chart (trend), heatmap (hour-week matrix).
* Accessibility: keyboard nav, ARIA labels, color-contrast-friendly palettes.
* Mobile-first: big touch targets and responsive charts.

---

## ✅ Developer Tips (quick)

* To change default port, edit `.env` or set `PORT` env var.
* To reset demo data, replace `backend/data/` files with the provided `demo-data/`.
* To change categories, frontend settings allow add/remove — backend will accept arbitrary category names.
* For production, set a strong `JWT_SECRET` and serve backend behind HTTPS.

---

## 🧪 Testing Recommendations

(Not required for running, but useful)

* Jest for backend unit tests (fileHandler, auth)
* Supertest for API route tests
* Cypress/Playwright for UI flows

---

## ❤️ Credits & License

Built for users who want a straightforward, modern time-analysis tool with server-side JSON persistence and no database complexity.
Open-source-friendly — include your preferred license file.

---

If you want I can now:

* generate the starter project files and the minimal working server + frontend skeleton, or
* produce the `server.js` and `fileHandler.js` that do safe JSON reads/writes plus the auth routes.

Which one should I produce right now?
