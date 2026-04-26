# ProPortal - Premium Project Management Portal

ProPortal is a high-performance, enterprise-grade project management application featuring a modern, glassmorphism-inspired UI and a robust PostgreSQL-backed intelligence layer.

## 🚀 Features

- **Multi-Role Dashboards**: Specialized views for Administrators, Organization Clients, and Regular Users.
- **Intelligence & Insights**: Advanced reporting with interactive charts (Recharts) and data visualization.
- **Strategic Management**: Full CRUD for Users, Clients, and Projects with real-time status tracking.
- **Premium UI**: Dark mode support, glassmorphism effects, smooth animations, and responsive layouts.
- **Secure Architecture**: JWT-based authentication with role-based access control (RBAC).

## 🛠️ Technology Stack

- **Frontend**: React.js, Material UI (MUI), Recharts, React Router 6, Axios.
- **Backend**: Node.js, Express.js, Sequelize ORM.
- **Database**: PostgreSQL.
- **Security**: BCryptJS, JWT, CORS, Helmet.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL (Running on port 5433 or 5432)

### 2. Database Configuration
1. Create a database named `project_portal` in PostgreSQL.
2. The application is configured to use **Sequelize Sync ({ alter: true })**, so tables will be created automatically on the first run.

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=project_portal
DB_PORT=5433
JWT_SECRET=secret123
CLIENT_URL=http://localhost:3000
```
Run the backend:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5001/api
```
Run the frontend:
```bash
npm start
```

---

## 🔑 Default Credentials

The system initializes with demo accounts for testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@example.com` | `admin123` |
| **Demo Client** | `client@example.com` | `client123` |
| **Regular User** | `user@example.com` | `user123` |

---

## 🏗️ Project Structure

```text
├── backend
│   ├── src
│   │   ├── config     # Database & App config
│   │   ├── controllers # API Logic
│   │   ├── middleware  # Auth & Error handling
│   │   ├── models      # Sequelize Models
│   │   └── routes      # Express Routes
│   └── server.js      # Entry point
├── frontend
│   ├── src
│   │   ├── components  # Reusable UI (Layout, Sidebar, etc)
│   │   ├── context     # Auth State Management
│   │   ├── pages       # Route-level components
│   │   └── services    # API Service layer
│   └── App.js          # Routing & Theme
└── README.md
```

## 📄 License
MIT License. Created with ❤️ for ProPortal delivery.
