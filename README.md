# 🌐 CrowdFundNext

**CrowdFundNext** is a full-stack crowdfunding platform that enables individuals to create, share, and support funding campaigns for innovative ideas, social causes, and personal needs — all built with the **MERN stack** and secured by **Firebase Authentication**.

---

## ✨ Project Highlights

- 🔐 Secure user authentication via Firebase (Google & Email/Password)
- 🎯 Role-based features: Admin vs User
- 💬 Campaigns with comments, likes, shares
- 💸 Donation and monthly subscription system
- 📢 Social media sharing for wider reach
- 🛠️ Admin dashboard to manage complaints, feedback, and campaigns

---

## 🧠 Non-Technical Overview

### 🎯 What is CrowdFundNext?

CrowdFundNext is a crowdfunding web application designed to empower users to raise funds for ideas, causes, or emergencies by leveraging the power of community support. It supports transparent campaign hosting, easy donations, and active engagement.

### 👥 Who Can Use It?

#### 1. **Users**
- Register/login securely
- Host crowdfunding campaigns
- Donate or subscribe to campaigns
- Like, comment, and share campaigns

#### 2. **Admins**
- Moderate campaigns
- Handle complaints/feedback
- Monitor platform activity

---

## ⚙️ Technical Overview

### 🚀 Tech Stack

| Layer         | Technology |
|---------------|------------|
| Frontend      | React.js (Vite + SWC), Material UI |
| Backend       | Node.js + Express.js |
| Database      | MongoDB Atlas |
| Auth          | Firebase Authentication |
| Deployment    | Docker Compose (local), Vercel/Render (cloud) |

---

### 📁 Folder Structure
```

CrowdFundNext/
├── client/         → React frontend (Vite + Firebase)
├── server/         → Node.js + Express + MongoDB + Firebase Admin
├── docker-compose.yml → Dev container orchestration
├── env.txt             → Environment variable reference
├── prompts.txt         → Development notes
└── README.md           → You're here!

````

---

### 🔐 Firebase Auth Flow
1. User logs in via Firebase
2. Firebase returns JWT (idToken)
3. Client sends this token with API requests
4. Server verifies token using Firebase Admin SDK
5. Server uses MongoDB for extended user info (roles, activity)

---

## 📡 APIs (WIP)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/test` | GET | Test server |
| `/api/users/register` | POST | Add new user |
| `/api/campaigns` | GET/POST | Get/create campaigns |
| `/api/comments/:id` | POST | Comment on campaign |
| `/api/admin/complaints` | GET | Admin-only view |

---

## 🐳 Docker Setup

### 1️⃣ Prerequisites
- Docker & Docker Compose installed
- Firebase credentials (see below)

### 2️⃣ Setup `.env` (based on `env.txt`)
Create `.env` files in root folder using the structure in `env.txt`.

### 3️⃣ Start the Project
```bash
docker-compose up --build
````

---

## 📦 Firebase Setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google + Email/Password)
3. Generate a Firebase Admin SDK key → save as `server/config/firebaseServiceAccount.json`
4. Add Firebase web config to `client/src/firebase.js`

---

## 🧪 Dev Tools & Libraries

* React Router DOM
* Axios
* Firebase JS SDK
* Mongoose
* Material UI
* Vite (w/ SWC)
* Docker
* Firebase Admin SDK

---

## 🧱 Future Features (Planned)

* 🎨 Campaign image uploads (via Cloudinary or Firebase Storage)
* 🧾 Razorpay/Stripe integration for real payments
* 🔔 Notifications & email alerts
* 📊 Analytics dashboard for admin
* 🔎 Campaign filtering, trending campaigns

---

## 🤝 Contributing

1. Fork the repo
2. Clone your fork
3. Create a new branch: `git checkout -b feature-name`
4. Make changes and commit: `git commit -m "Added new feature"`
5. Push to branch: `git push origin feature-name`
6. Open a pull request

---

## 🧑‍💻 Author

**Ali Ahammad (Li)**
[Portfolio](https://www.aliahammad.com/) | [LinkedIn](https://www.linkedin.com/in/ali-ahammad-li0812/) | [GitHub](https://github.com/li812)

---

## 📝 License

This project is for educational and academic use under the **MIT License**. See `LICENSE` for more info.

---

## 💬 Feedback?

Feel free to open an issue or share feedback through the platform once deployed!
