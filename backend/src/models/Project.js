const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'on-hold'),
        defaultValue: 'pending'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'start_date'
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_date'
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'client_id'
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'assigned_to'
    }
}, {
    timestamps: true,
    tableName: 'projects'
});

module.exports = Project;