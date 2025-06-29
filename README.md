# 🌐 CrowdFundNext

**CrowdFundNext** is a full-stack, production-grade crowdfunding platform built with the **MERN stack** (MongoDB, Express, React, Node.js), featuring modern authentication, real payments, AI-powered campaign creation, robust admin/user management, and advanced file handling.

---

## 🏗️ Architecture Overview

```mermaid
graph TD;
  A[React Frontend (Vite + MUI)] --|REST/JSON|--> B[Express.js API]
  B --|Mongoose|--> C[MongoDB Atlas]
  B --|Firebase Admin SDK|--> D[Firebase Auth]
  A --|Firebase JS SDK|--> D
  A --|PayPal JS SDK|--> E[PayPal API]
  B --|Google GenAI SDK|--> F[AI Services]
  B --|multer|--> G[File Storage (uploads/)]
```

- **Frontend:** React (Vite), Material UI, Firebase JS SDK, PayPal SDK
- **Backend:** Node.js, Express, Firebase Admin SDK, Google GenAI, Multer
- **Database:** MongoDB Atlas
- **Payments:** PayPal REST API
- **AI:** Google GenAI (Gemini) for campaign content and chatbot
- **File Storage:** Local server (uploads/), auto-cleanup

---

## ✨ Key Features (Deep Dive)

### 🔐 Authentication & Security
- **Firebase Authentication** for Google OAuth and email/password
- **JWT-based session management** for secure API access
- **Google OAuth**: One-click sign up/login, seamless integration
- **Role-based access**: User/admin separation
- **Fraud prevention**: Cannot delete account with active campaigns; all transactions tracked
- **Environment variables**: All secrets/configs in `.env` files

### 🤖 AI Integration
- **AI Generate Modal**: Instantly generate campaign titles/descriptions using Google GenAI (Gemini)
- **Hoppy Chatbot**: In-app AI assistant for onboarding and support, powered by backend AI service
- **Backend AI Service**: Node.js service connects to Google GenAI API

### 💸 Payments & Withdrawals
- **PayPal Integration**: Real, secure donations via PayPal SDK (no overfunding allowed)
- **Withdrawal System**: Campaign creators can withdraw funds (partial/full), with bank details and anti-fraud logic
- **Transaction Model**: All donations and withdrawals stored as transactions in MongoDB
- **Withdrawal History**: UI shows withdrawal stats and history per campaign

### 🗂️ File Management
- **Uploads**: Profile pictures, campaign photos, support documents (PDF)
- **Multer-based upload services**: Separate for campaigns and users
- **Automatic Cleanup**: Files deleted on campaign/user deletion (backend logic)
- **Static Serving**: `/uploads` route for serving images/docs

### 🛠️ Admin Controls
- **Admin Dashboard**: Manage users, campaigns, and transactions
- **Campaign Moderation**: Approve/reject, filter by status, country, state, type
- **Platform Stats**: View total funds, campaigns, and leaderboards
- **Advanced Filtering**: By country, state, type, and search

### 📊 User Experience
- **Modern UI/UX**: Material UI, responsive design, glassmorphic effects
- **Conditional Actions**: Donate button hidden for own campaigns; edit/delete only for eligible campaigns
- **Leaderboard**: Top donors and campaigns
- **Profile Management**: Edit info, upload/change profile picture
- **Instant Help**: Hoppy chatbot always available

---

## 🗺️ Main Pages & Components

### Pages
- **HomePage**: Landing, explore, about, contact
- **RegisterPage/LoginPage**: Auth (Google/email), profile image upload
- **UserHome**: User dashboard, campaign stats
- **UserCampaigns**: List/manage own campaigns, withdrawal history
- **UserPostCampaign**: Create campaign (AI modal, file upload)
- **UserSettings**: Profile, password, delete account
- **AdminDashboard**: Platform stats, leaderboards
- **AdminManageCampaigns/Users/Transactions**: Full admin controls

### Components
- **CampainCard**: Campaign display, donate, edit, withdraw
- **AIGenerateModal**: AI-powered content creation
- **DonationAmountModal/PayPalDonateModal**: PayPal donation flow
- **EditCampaignModal**: Edit campaign details/files
- **ChatBotFloatingButton/UI**: Hoppy chatbot
- **ProfileForm**: Edit profile, upload/change picture
- **Leaderboard**: Top donors/campaigns
- **NavBar/Footer**: Contextual navigation for home/user/admin

---

## 🔌 API Overview (Key Endpoints)

- `POST /api/auth/register` — Register user (with profile picture upload)
- `POST /api/auth/login` — Login (JWT)
- `GET /api/campaigns` — List/search campaigns (with filters)
- `POST /api/campaigns` — Create campaign (with file upload)
- `PATCH /api/campaigns/:id` — Edit campaign (with file upload)
- `DELETE /api/campaigns/:id` — Delete campaign (auto file cleanup)
- `POST /api/campaigns/:id/donate` — Donate (PayPal)
- `