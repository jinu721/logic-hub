# LogicHub - Enterprise Code Challenge Platform

![Logo](https://via.placeholder.com/150x50?text=LogicHub)

LogicHub is a comprehensive, enterprise-grade platform designed for developers to sharpen their coding skills through a variety of challenges, ranging from algorithmic problems to specialized ciphers. It features a robust gamification system, real-time collaboration, and an advanced code execution engine.

## 🚀 Vision
To provide a high-performance, scalable, and engaging environment for developers to compete, learn, and grow their logical thinking and programming proficiency.

---

## ✨ Core Features

### 🎮 Gamification & XP System
LogicHub implements a sophisticated progression system to keep users engaged:
- **XP Points**: Earned by successfully completing challenges.
- **Leveling System**: Users progress through levels (e.g., Novice, Adept, Master) as they accumulate XP.
- **Dynamic Rewards**: Leveling up unlocks special rewards, badges, and platform features.
- **Leaderboards**: Competitive ranking based on XP, score, and completion speed.

### 👥 Community & Collaboration
- **Groups**: Create or join communities to collaborate on challenges.
- **Team Challenges**: Participate in challenges as a group (integrated with Membership logic).
- **Global Presence**: Track user presence and activity across the platform via real-time sockets.

### 🧩 Challenges & Code Execution
- **Multi-Level Challenges**: Problems categorized into Novice, Adept, and Master difficulty.
- **Code Execution Engine**: Advanced runner integrated with **Judge0** for secure, real-time code evaluation across multiple languages (C++, Java, Python, JavaScript, Rust, SQL, etc.).
- **Cipher Challenges**: Specialized logic puzzles and cryptography-based challenges.
- **Detailed Analytics**: Performance metrics including runtime, memory usage, and test case pass ratios.
- **User Heatmaps**: Visual representation of user activity and consistency over time (GitHub-style).

### 💬 Social & Real-time Integration
- **Real-time Chat**: Global and group-based chat systems powered by **Socket.IO**.
- **Instant Notifications**: Real-time alerts for rewards, level-ups, and platform updates.
- **Solution Sharing**: Users can share and discuss solutions with the community.

### 🏪 Marketplace & Inventory
- **Token Economy**: Internal currency earned through challenges.
- **Market**: Purchase premium items, profile customizations, and virtual gifts.
- **Premium Membership**: Subscription plans for exclusive content, advanced analytics, and increased rewards.
- **Inventory System**: Manage owned items and rewards.

---

## 🏗️ Architecture & Folder Structure

LogicHub follows a **Modular Clean Architecture** with a strict separation of concerns, ensuring high maintainability and scalability.

### Project Structure (Monorepo)
```
logic-hub/
├── backend/            # Express.js & TypeScript Backend
├── frontend/           # Next.js 15 & React 19 Frontend
```

### 🔙 Backend Architecture
The backend is built with **Node.js/TypeScript** and follows a modular pattern inspired by Domain-Driven Design (DDD).

- **Framework**: Express.js
- **Pattern**: Modular Architecture with Dependency Injection.
- **Key Concepts**:
    - **CQRS**: Segregation of Command (write) and Query (read) operations for complex modules like Challenges.
    - **Repository Pattern**: Abstraction layer for data access (MongoDB/Mongoose).
    - **Service Layer**: Encapsulation of business logic.
    - **Dependency Injection**: Custom DI container for loose coupling and high testability.
    - **DTO Pattern**: Data Transfer Objects with built-in validation.

#### Backend Folder Structure
```
backend/src/
├── modules/           # Feature-based domain modules
│   ├── user/          # User management & authentication
│   ├── challenge/     # Problem sets & execution logic
│   ├── level/         # progression & XP logic
│   ├── chat/          # Real-time messaging
│   └── ...            # analytics, membership, market, etc.
├── shared/            # Cross-cutting concerns
│   ├── core/          # Base classes (BaseRepository, BaseService)
│   ├── providers/     # External integrations (Redis, Cloudinary, AWS)
│   ├── middlewares/   # Auth, Error handling, Logging
│   └── utils/         # Helper functions
├── config/            # System & environment configuration
├── di/                # Dependency Injection setup
└── execution/         # Code execution engine & Judge0 integration
```

### 🎨 Frontend Architecture
Modern, high-performance UI built with **Next.js 15 (App Router)**.

- **Framework**: Next.js 15 (React 19)
- **State Management**: Redux Toolkit (global state) & React Context.
- **Styling**: Tailwind CSS with Framer Motion for premium animations.
- **UI Components**: Radix UI & Shadcn/ui for accessible, professional components.
- **Rich Interaction**: CodeMirror & Monaco Editor for an IDE-like experience.

#### Frontend Folder Structure
```
frontend/src/
├── app/               # Next.js App Router (Pages & Layouts)
├── components/        # Reusable UI components
├── redux/             # Global state management
├── services/          # API integration layer (Axios)
├── hooks/             # Custom React hooks
├── types/             # TypeScript interfaces & definitions
└── utils/             # Frontend utility functions
```

---

## 🛠️ Tech Stack

### Frontend
- **Core**: Next.js 15, React 19, TypeScript
- **State**: Redux Toolkit, React-Redux
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons
- **Editors**: Monaco Editor, CodeMirror
- **Charts**: Recharts
- **Rich Text**: TipTap
- **Real-time**: Socket.io-client

### Backend
- **Core**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose), Redis (Caching)
- **Messaging**: RabbitMQ (AMQP)
- **Real-time**: Socket.IO
- **Security**: JWT, Passport (Google/GitHub), bcryptjs, Helmet
- **Storage**: Cloudinary
- **Payments**: Razorpay
- **Worker Threads**: Piscina (Heavy task offloading)
- **Logging**: Winston & Morgan

---

## 📜 Coding Standards & Patterns

LogicHub adheres to industry-leading software engineering standards:

1.  **SOLID Principles**:
    - **SRP**: Each class/service has a single, well-defined responsibility.
    - **DIP**: High-level modules depend on abstractions (interfaces), not concrete implementations.
2.  **Modularization**: Self-contained modules that can be scaled or updated independently.
    - `controllers/` -> HTTP logic
    - `services/` -> Business logic
    - `repositories/` -> Database logic
3.  **Clean Code**:
    - Consistent naming conventions (PascalCase for classes, camelCase for variables).
    - Comprehensive Type Safety with TypeScript.
    - DRY (Don't Repeat Yourself) through base classes and shared utilities.
4.  **Security First**:
    - Input validation through DTOs.
    - Rate limiting and CSRF protection.
    - Secure password hashing and JWT-based authentication.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis (Optional for local development)
- Cloudinary Account (for image uploads)
- Judge0 API Key (for code execution)

### Installation
1. Clone the repository: `git clone https://github.com/jinu721/logic-hub.git`
2. Install dependencies:
   ```bash
   # Root directory
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders.
   - Fill in your credentials.

### Running Locally
- **Backend**: `npm run dev` (Runs on port 5000 by default)
- **Frontend**: `npm run dev` (Runs on port 3000 by default)

---

## ⚖️ License
Distributed under the ISC License. See `LICENSE` for more information.

---
