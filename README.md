# 📊 WhatsApp Poll Extractor

A robust, multi-tenant Full-Stack SaaS application for creating, managing, and extracting WhatsApp-style polls. 
The system enforces strict role-based data isolation across organizations and includes a centralized web dashboard alongside a mobile application.

---

## 🚀 Built With

- **Backend:** [NestJS](https://nestjs.com/) (Node.js framework), TypeScript, PostgreSQL, Prisma ORM
- **Frontend Panel:** [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS, ShadCN UI
- **Mobile App:** [React Native](https://reactnative.dev/) (Expo), NativeWind (Tailwind for Mobile)
- **Authentication:** JWT, Role-Based Access Guards (RBAC)

---

## 🧠 Core Roles Architecture

The system supports strict tenant isolation using an `organization_id` strategy:
1. **👑 SuperAdmin:** Global control, manages all organizations and admins, has a global killswitch (`isServiceActive`).
2. **💼 Admin (Tenant Owner):** Manages a specific organization, creates polls, views results, and exports data.
3. **👥 User:** Belongs to one organization, answers polls, and tracks their vote history.

---

## 📁 Repository Structure
```
Poll_Metric/
├── backend/       # NestJS REST API Server & Prisma Database Schemas
├── frontend/      # Next.js Web Dashboard for SuperAdmins and Admins
└── mobile/        # React Native application for Users
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **npm** or **yarn**
- **PostgreSQL** Database instance running locally or hosted

---

## 🛠️ Installation & Setup

### 1. Backend (API Server)
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Setup your Environment variables
# Create a .env file based on the provided .env.example (or manually copy below)
# DATABASE_URL="postgresql://user:password@localhost:5432/poll_metric?schema=public"
# JWT_SECRET="your-secret-key"

# Run database migrations and generate the Prisma Client
npx prisma generate
npx prisma migrate dev --name init

# Start the NestJS development server (defaults to http://localhost:3000)
npm run start:dev
```

### 2. Frontend (Web Dashboard)
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Next.js development server (defaults to http://localhost:3001)
npm run dev
```

### 3. Mobile App (User Interface)
```bash
# Open a new terminal and navigate to the mobile directory
cd mobile

# Install dependencies
npm install

# Start the Expo bundler
npx expo start
```
*You can press `a` to open the app on Android Emulator, `i` for iOS Simulator, or scan the QR code with the Expo Go app on your physical device.*

---

## 🛡️ Security Rules enforced

- All user passwords are encrypted using `bcrypt`.
- Every database query automatically references `organization_id` using Prisma to avoid tenant bleeding.
- Duplicate vote entries check is handled securely at the Database constraint layer (Composite unique key on `[pollId, userId]`).
- Request objects enforce strict DTO validation globally.

---

## 🤝 Contribution Guidelines
Make sure you create atomic branches out of `main` starting with `feat/`, `fix/`, or `chore/`. Happy hacking!
