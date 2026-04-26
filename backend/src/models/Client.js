const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'company_name'
    },
    contactPerson: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'contact_person'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true,
    tableName: 'clients'
});

module.exports = Client;