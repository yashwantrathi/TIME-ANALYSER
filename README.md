# ⭐ Time Analyser – README

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


