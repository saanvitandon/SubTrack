# SubTrack

A full-stack Subscription Management Dashboard to track, manage, and analyze your recurring expenses in one place.

## Overview

SubTrack is a modern web-based subscription management system that helps users monitor and control their recurring payments such as Netflix, Spotify, Gym memberships, and more.

The application has implemented a **full-stack system with authentication, database integration, analytics, and OAuth login**.

---

## ✨ Features

### 🔐 Authentication

- User Signup & Login (Email + Password)
- Google OAuth Login
- GitHub OAuth Login
- Secure password hashing using bcrypt
- JWT-based authentication

### 📊 Subscription Management

- Add new subscriptions
- Edit existing subscriptions
- Delete subscriptions
- Store data securely in MongoDB

### 📈 Dashboard

- View all active subscriptions
- Monthly spending calculation
- Subscription count overview

### 📉 Analytics

- Category-wise spending breakdown
- Per-plan contribution visualization
- Smart insights into user spending
- Upcoming renewal reminders based on billing cycle

### ⏰ Smart Features

- Automatic billing cycle handling (monthly/yearly)
- Renewal date calculation
- Upcoming & urgent reminders

### 🎨 UI/UX

- Clean and responsive design
- Dark / Light mode toggle
- Custom-styled calendar (Flatpickr integration)
- Consistent modern UI across pages

---

## 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Chart.js (for analytics)
- Flatpickr (custom calendar UI)

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT (JSON Web Tokens)
- Passport.js
- Google OAuth 2.0
- GitHub OAuth

---

## 📁 Project Structure

```
SubTrack/
│
├── frontend/                 # Client-side UI
│   ├── login.html
│   ├── signup.html
│   ├── index.html
│   ├── add.html
│   ├── analytics.html
│   ├── style.css
│   ├── script.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── add.js
│   ├── analytics.js
│
├── backend/                 # Server-side logic
│   ├── server.js
│   ├── config/
│   │   └── passport.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── subscriptions.js
│   ├── middleware/
│   │   └── auth.js
│   └── .env                 # (not committed)
│
└── README.md
```
