📖 Complete README.md for Softxic-Lab

```markdown
# 🚀 Softxic-Lab - Enterprise MERN Blog Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

> **A Production-Grade Blog Management System with Admin Approval Workflow, 24-Hour Auto-Approval, and Complete Engagement Features**

## 📌 Live Demo

| Service | URL |
|---------|-----|
| **Backend API** | [https://softxic-lab-backend.vercel.app](https://softxic-lab-backend.vercel.app) |
| **Frontend** | [Coming Soon] |
| **API Documentation** | [https://softxic-lab-backend.vercel.app/health](https://softxic-lab-backend.vercel.app/health) |

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📊 System Design](#-system-design)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📡 API Endpoints](#-api-endpoints)
- [🔒 Environment Variables](#-environment-variables)
- [📈 Database Schema](#-database-schema)
- [🎨 UI Components](#-ui-components)
- [📦 Deployment](#-deployment)
- [📝 License](#-license)
- [👨‍💻 Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin, Author, User)
- Google OAuth integration
- Secure password hashing with bcryptjs

### 📝 Post Management
- Full CRUD operations with rich text editor
- Draft/Publish system with 6 status types
- Admin approval workflow with rejection reasons
- 24-hour auto-approval timer for pending posts
- Edit request system (needs admin approval)
- Delete request system (needs admin approval)

### 💬 Comment System
- Nested comments with real-time updates
- Like/Unlike functionality
- Edit and delete with proper permissions
- User profile pictures in comments
- Moment.js for relative timestamps

### ❤️ Engagement Features
- **Like System** - Toggle likes with real-time counter
- **Save/Bookmark** - Save posts to personal collection
- **Share System** - Track share counts with copy link
- **View Counter** - Track post views

### 👥 Role-Based Dashboards

#### Admin Dashboard
- View all posts with filters (status, author, category)
- Approve or reject pending posts with reasons
- Manage all user comments
- User management with role updates
- Analytics and statistics

#### Author Dashboard
- View personal posts with status tracking
- Submit drafts for approval
- Edit/Delete own posts
- Track pending approvals and rejections

### 🎨 UI/UX Excellence
- Fully responsive design (Mobile, Tablet, Desktop)
- Dark/Light mode toggle
- Gradient backgrounds and glassmorphism effects
- Smooth animations and transitions
- Custom toast notifications
- Professional scrollbar styling
- Loading skeletons and spinners

### 🔧 Technical Features
- MongoDB indexes for query optimization
- Cloudinary image upload with optimization
- Search and pagination
- CORS configuration for security
- Global error handling middleware
- Request validation and sanitization

---

## 🏗️ Architecture

### System Architecture Diagram

```

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   React     │  │  Redux      │  │  Tailwind   │  │  React      │        │
│  │   Components│  │  Toolkit    │  │   CSS       │  │  Router DOM │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │               │
│         └────────────────┴────────────────┴────────────────┘               │
│                                    │                                        │
│                              HTTP Requests                                  │
│                                    │                                        │
└────────────────────────────────────┼────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Node.js + Express)                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API Gateway                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │   Auth   │  │   User   │  │   Post   │  │ Comment  │            │   │
│  │  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │            │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │   │
│  └───────┼─────────────┼─────────────┼─────────────┼──────────────────┘   │
│          │             │             │             │                       │
│  ┌───────┼─────────────┼─────────────┼─────────────┼──────────────────┐   │
│  │       ▼             ▼             ▼             ▼                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │   JWT    │  │   Role   │  │  Error   │  │   CORS   │           │   │
│  │  │ Middleware│ │   Check  │  │  Handler │  │   Config │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                              ┌──────┴──────┐                               │
│                              ▼             ▼                               │
│                    ┌─────────────┐  ┌─────────────┐                        │
│                    │  MongoDB    │  │  Cloudinary │                        │
│                    │  Database   │  │  Storage    │                        │
│                    └─────────────┘  └─────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────┘

```

### Data Flow Diagram

```

┌─────────────────────────────────────────────────────────────────────────────┐
│                           POST APPROVAL WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Author ──► Create Draft ──► Submit ──► Pending ──┐                       │
│                                                      │                       │
│                                           ┌──────────┴──────────┐            │
│                                           ▼                     ▼            │
│                                     Admin Approves       24-Hour Timer       │
│                                           │                     │            │
│                                           ▼                     ▼            │
│                                    Published ──────────► Auto-Publish        │
│                                                                             │
│                                    If Rejected ──► Rejected with Reason     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDIT/DELETE REQUEST FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Author ──► Request Edit/Delete ──► Pending Action ──┐                    │
│                                                         │                    │
│                                              ┌──────────┴──────────┐         │
│                                              ▼                     ▼         │
│                                        Admin Approves       24-Hour Timer    │
│                                              │                     │         │
│                                              ▼                     ▼         │
│                                        Action Applied      Auto-Apply        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

```

### Database Relationship Diagram

```

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│       User       │     │       Post       │     │     Comment      │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ _id (ObjectId)   │────▶│ userId (ref)     │     │ _id (ObjectId)   │
│ username         │     │ title            │◀────│ postId (ref)     │
│ email            │     │ content          │     │ userId (ref)     │
│ password         │     │ slug             │     │ content          │
│ role (admin/     │     │ status           │     │ likes[]          │
│      author/user)│     │ likes[] ────────▶│     │ numberOfLikes    │
│ profilePicture   │     │ numberOfLikes    │     │ createdAt        │
│ isAdmin          │     │ savedBy[]        │     │ updatedAt        │
│ createdAt        │     │ numberOfSaves    │     └──────────────────┘
│ updatedAt        │     │ shares[]         │
└──────────────────┘     │ numberOfShares   │
│ publishedAt      │
│ approvedAt       │
│ approvedBy (ref) │
│ rejectionReason  │
│ editRequestData  │
│ autoApproveAt    │
│ createdAt        │
│ updatedAt        │
└──────────────────┘

```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Library |
| Redux Toolkit | 1.9.5 | State Management |
| React Router DOM | 6.14.0 | Routing |
| Tailwind CSS | 3.3.0 | Styling |
| Flowbite React | 0.7.0 | UI Components |
| React Icons | 4.10.0 | Icons |
| React Quill | 2.0.0 | Rich Text Editor |
| Moment.js | 2.29.4 | Date Formatting |
| React Circular Progressbar | 2.1.0 | Image Upload Progress |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime |
| Express.js | 4.19.2 | Web Framework |
| MongoDB | 5.0+ | Database |
| Mongoose | 8.5.3 | ODM |
| JWT | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password Hashing |
| Cloudinary | 1.41.3 | Image Storage |
| Multer | 2.1.1 | File Upload |
| Node Cron | 4.2.1 | Scheduled Tasks |

### DevOps
| Service | Purpose |
|---------|---------|
| Vercel | Backend Deployment |
| MongoDB Atlas | Cloud Database |
| Cloudinary | Image CDN |
| GitHub | Version Control |

---

## 📁 Project Structure

```

softxic-lab/
├── api/                          # Backend Application
│   ├── config/
│   │   └── cloudinary.js         # Cloudinary configuration
│   ├── controller/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── user.controller.js    # User management
│   │   ├── post.controller.js    # Post CRUD + Approval
│   │   ├── comment.controller.js # Comment management
│   │   └── upload.controller.js  # Image upload
│   ├── middleware/
│   │   └── roleCheck.js          # Role-based authorization
│   ├── model/
│   │   ├── user.model.js         # User schema
│   │   ├── post.model.js         # Post schema
│   │   └── comment.model.js      # Comment schema
│   ├── routes/
│   │   ├── auth.route.js         # Auth endpoints
│   │   ├── user.route.js         # User endpoints
│   │   ├── post.route.js         # Post endpoints
│   │   ├── comment.route.js      # Comment endpoints
│   │   └── upload.route.js       # Upload endpoints
│   ├── utils/
│   │   ├── error.js              # Error handler
│   │   └── verifyUser.js         # JWT verification
│   └── index.js                  # Backend entry point
│
├── client/                       # Frontend Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminAllPosts.jsx # Admin post management
│   │   │   ├── DashhPost.jsx     # Author post management
│   │   │   ├── DashComments.jsx  # Comment management
│   │   │   ├── DashSidebar.jsx   # Dashboard sidebar
│   │   │   ├── Comment.jsx       # Comment component
│   │   │   ├── CommentSection.jsx# Comments section
│   │   │   ├── LikeButton.jsx    # Like functionality
│   │   │   ├── SaveButton.jsx    # Save functionality
│   │   │   ├── ShareButton.jsx   # Share functionality
│   │   │   └── OAuth.jsx         # Google OAuth
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Homepage
│   │   │   ├── Post.jsx          # Post by slug
│   │   │   ├── PostById.jsx      # Post by ID
│   │   │   ├── Dashboard.jsx     # Dashboard
│   │   │   ├── CreatePost.jsx    # Create post
│   │   │   ├── UpdatePost.jsx    # Update post
│   │   │   ├── SignIn.jsx        # Login
│   │   │   ├── SignUp.jsx        # Register
│   │   │   └── Search.jsx        # Search page
│   │   ├── redux/
│   │   │   ├── store.js          # Redux store
│   │   │   ├── user/
│   │   │   │   └── userSlice.js  # User state
│   │   │   └── theme/
│   │   │       └── themeSlice.js # Theme state
│   │   ├── App.jsx               # Main app
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── .env                          # Environment variables
├── .gitignore
├── README.md
└── package.json

```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
MongoDB >= 5.0
npm or yarn
```

Installation

1. Clone the Repository

```bash
git clone https://github.com/yourusername/softxic-lab.git
cd softxic-lab
```

2. Install Backend Dependencies

```bash
cd api
npm install
```

3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

4. Environment Setup

Create .env file in the api directory:

```env
# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/mern_blog

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

5. Run Backend Server

```bash
cd api
npm run dev
# Server runs on http://localhost:3000
```

6. Run Frontend Development Server

```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

📡 API Endpoints

Authentication Routes (/api/v1/auth)

Method Endpoint Description Auth
POST /signUp Register new user ❌
POST /signIn Login user ❌
POST /google Google OAuth login ❌
PUT /role/:userId Update user role ✅ Admin

User Routes (/api/v1/user)

Method Endpoint Description Auth
PUT /update/:userId Update user profile ✅ Owner
DELETE /delete/:userId Delete user account ✅ Owner/Admin
POST /signOut Logout user ✅
GET /getUsers Get all users ✅ Admin
GET /:userId Get single user ✅

Post Routes (/api/v1/post)

Method Endpoint Description Auth
GET /getPosts Get all published posts ❌
POST /create Create new post ✅ Author/Admin
DELETE /deletePost/:postId Delete post ✅ Owner/Admin
PUT /updatePost/:postId Update post ✅ Owner/Admin
GET /getUserDrafts Get user drafts ✅ Author/Admin
PUT /like/:postId Like/Unlike post ✅
PUT /save/:postId Save/Unsave post ✅
PUT /share/:postId Share post ✅
PUT /submit-for-approval/:postId Submit for admin approval ✅ Author
PUT /approve-post/:postId Approve pending post ✅ Admin
PUT /reject-post/:postId Reject post ✅ Admin
PUT /request-edit/:postId Request edit ✅ Author
PUT /request-delete/:postId Request delete ✅ Author
GET /admin/all-posts Get all posts ✅ Admin

Comment Routes (/api/v1/comment)

Method Endpoint Description Auth
GET /getComments/:postId Get post comments ❌
POST /create Create comment ✅
PUT /likeComment/:commentId Like comment ✅
PUT /editComment/:commentId Edit comment ✅ Owner/Admin
DELETE /deleteComment/:commentId Delete comment ✅ Owner/Admin
GET /getAllUsersComments Get all comments ✅ Admin

Upload Routes (/api/v1/upload)

Method Endpoint Description Auth
POST /upload Upload image to Cloudinary ✅

---

🔒 Environment Variables

Backend (.env)

Variable Description Required
MONGO_URL MongoDB connection string ✅
JWT_SECRET Secret key for JWT ✅
CLOUDINARY_CLOUD_NAME Cloudinary cloud name ✅
CLOUDINARY_API_KEY Cloudinary API key ✅
CLOUDINARY_API_SECRET Cloudinary API secret ✅
FRONTEND_URL Frontend URL for CORS ❌
PORT Server port (default: 3000) ❌
NODE_ENV Environment (development/production) ❌

Frontend (.env)

Variable Description Required
VITE_API_URL Backend API URL ✅

---

📈 Database Schema

User Schema

```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "..." },
  role: { type: String, enum: ["user", "author", "admin"], default: "user" },
  isAdmin: { type: Boolean, default: false }
}
```

Post Schema

```javascript
{
  userId: { type: ObjectId, ref: "User", required: true },
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ["draft", "pending", "published", "rejected", "pending_edit", "pending_delete"],
    default: "draft" 
  },
  image: { type: String, default: "..." },
  category: { type: String, default: "uncategorized" },
  likes: [{ type: ObjectId, ref: "User" }],
  numberOfLikes: { type: Number, default: 0 },
  savedBy: [{ type: ObjectId, ref: "User" }],
  numberOfSaves: { type: Number, default: 0 },
  shares: [{ type: ObjectId, ref: "User" }],
  numberOfShares: { type: Number, default: 0 },
  publishedAt: { type: Date, default: null },
  approvedAt: { type: Date, default: null },
  approvedBy: { type: ObjectId, ref: "User" },
  rejectionReason: { type: String, default: null },
  editRequestData: { type: Object, default: null },
  autoApproveAt: { type: Date, default: null }
}
```

Comment Schema

```javascript
{
  content: { type: String, required: true },
  postId: { type: ObjectId, ref: "Post", required: true },
  userId: { type: ObjectId, ref: "User", required: true },
  likes: [{ type: ObjectId, ref: "User" }],
  numberOfLikes: { type: Number, default: 0 }
}
```

---

🎨 UI Components

Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 Home  │  📝 Posts  │  👤 Profile  │  🌙 Theme  │  🚪 Logout│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   STATS CARDS                        │   │
│  │  📊 Total  │  ✅ Published  │  ⏳ Pending  │  ✏️ Draft │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    POSTS TABLE                       │   │
│  │  Date  │  Image  │  Title  │  Status  │  Actions   │   │
│  │  ...   │   ...   │   ...   │   ...    │  View/Edit │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Responsive Breakpoints

Device Breakpoint Layout
Mobile < 640px Single column, card view
Tablet 640px - 1024px 2-3 columns, hybrid view
Desktop 1024px Full table, multi-column

---

📦 Deployment

Deploy Backe
