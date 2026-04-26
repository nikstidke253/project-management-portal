const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { syncDatabase } = require('./src/models');
const errorHandler = require('./src/middleware/error.middleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./src/routes/authroutes');
const userRoutes = require('./src/routes/userroutes');
const clientRoutes = require('./src/routes/clientroutes');
const projectRoutes = require('./src/routes/projectroutes');
const reportRoutes = require('./src/routes/reportroutes');
const settingsRoutes = require('./src/routes/settingsroutes');
const uploadRoutes = require('./src/routes/uploadroutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server with port fallback
const startServer = async () => {
    try {
        await syncDatabase();

        let PORT = process.env.PORT || 5000;

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
            console.log('\n🔐 Demo Credentials:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('👑 Admin:   admin@example.com / admin123');
            console.log('🏢 Client:  client@example.com / client123');
            console.log('👤 User:    user@example.com / user123');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`❌ Port ${PORT} is busy, trying port ${PORT + 1}...`);
                server.listen(PORT + 1);
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();