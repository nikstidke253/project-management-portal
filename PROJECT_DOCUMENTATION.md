# Project Management Portal - Documentation

Welcome to the **Project Management Portal**, a full-stack solution for managing clients, projects, and users with a modern, responsive UI.

## 🚀 Live Application
- **Frontend/Site URL**: [https://project-management-portal-71cw.onrender.com](https://project-management-portal-71cw.onrender.com)
- **Backend API URL**: [https://project-management-portal-71cw.onrender.com/api](https://project-management-portal-71cw.onrender.com/api)

## 🔐 Demo Credentials
You can use these pre-seeded accounts to test the different roles in the system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **👑 Admin** | `admin@example.com` | `admin123` |
| **🏢 Client** | `client@example.com` | `client123` |
| **👤 User** | `user@example.com` | `user123` |

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19
- **UI Library**: Material UI (MUI) 9
- **Icons**: MUI Icons
- **State Management**: React Context API
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS
- **File Uploads**: Multer (Local storage)

---

## 📂 Project Structure

```text
project-management-portal/
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database & Auth config
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & Error handlers
│   │   ├── models/         # Sequelize DB models
│   │   └── routes/         # API endpoints
│   └── server.js           # Entry point
├── frontend/               # React Application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # Auth & Global state
│       ├── pages/          # Page components (Admin, Client, User)
│       ├── services/       # API integration services
│       └── App.js          # Main component & Routing
└── render.yaml             # Deployment configuration
```

---

## ✨ Key Features

### 1. Dashboard & Analytics
- Real-time statistics for projects, clients, and active users.
- Visual data representation using bar charts and line graphs.
- Quick action shortcuts for common tasks.

### 2. Role-Based Access Control (RBAC)
- **Admin**: Full access to manage users, clients, projects, and view all reports.
- **Client**: Can view their own projects, progress, and communicate with the team.
- **User (Staff)**: Can view assigned projects, update status, and manage their profile.

### 3. Client & Project Management
- CRUD operations for clients and projects.
- Status tracking (Pending, In Progress, Completed).
- Link projects to specific clients and assign them to staff members.

### 4. Profile & Security
- Modern profile page with glassmorphism design.
- Avatar upload functionality.
- Password change and basic account settings.

---

## 🌐 Deployment on Render

The project is configured for easy deployment using Render's **Blueprints**.

1. **Database**: A managed PostgreSQL instance is provisioned automatically.
2. **Backend**: A Node.js Web Service handles the API and database synchronization.
3. **Frontend**: A Static Site builds and serves the React application.

**Deployment Steps:**
1. Push the code to GitHub.
2. Create a new **Blueprint** on Render.
3. Render will use `render.yaml` to set up all services automatically.
