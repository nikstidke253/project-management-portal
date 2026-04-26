const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');
const Project = require('./Project');
const ActivityLog = require('./ActivityLog');

// Define associations
User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

Client.hasMany(Project, { foreignKey: 'clientId' });
Project.belongsTo(Client, { foreignKey: 'clientId' });

User.hasMany(Project, { foreignKey: 'assignedTo' });
Project.belongsTo(User, { foreignKey: 'assignedTo' });

// Sync database
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');

        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

        // Create default admin
        const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
        if (!adminExists) {
            await User.create({
                name: 'Super Admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
                isActive: true
            });
            console.log('✅ Admin created: admin@example.com / admin123');
        }

        // Create demo client
        const clientExists = await User.findOne({ where: { email: 'client@example.com' } });
        if (!clientExists) {
            await User.create({
                name: 'Demo Client',
                email: 'client@example.com',
                password: 'client123',
                role: 'client',
                isActive: true
            });
            console.log('✅ Client created: client@example.com / client123');

            await Client.create({
                companyName: 'Demo Company',
                contactPerson: 'Demo Client',
                phone: '+1234567890',
                email: 'client@example.com',
                address: '123 Demo Street',
                status: 'active'
            });
        }

        // Create demo user
        const userExists = await User.findOne({ where: { email: 'user@example.com' } });
        if (!userExists) {
            await User.create({
                name: 'Demo User',
                email: 'user@example.com',
                password: 'user123',
                role: 'user',
                isActive: true
            });
            console.log('✅ User created: user@example.com / user123');
        }

    } catch (error) {
        console.error('❌ Database error:', error.message);
    }
};

module.exports = {
    sequelize,
    User,
    Client,
    Project,
    ActivityLog,
    syncDatabase
};