const { User } = require('../models');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        
        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const { name, email, role, isActive } = req.body;
        
        if (req.user.role === 'admin') {
            if (role) user.role = role;
            if (isActive !== undefined) user.isActive = isActive;
        }
        
        if (name) user.name = name;
        if (email) user.email = email;
        
        await user.save();
        
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await user.destroy();
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };