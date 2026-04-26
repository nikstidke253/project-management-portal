const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
const register = async (req, res) => {
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
            role: role || 'user'
        });
        
        const token = generateToken(user.id);
        
        res.status(201).json({
            success: true,
            token,
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

// @desc    Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is disabled' });
        }
        
        await user.update({ lastLogin: new Date() });
        
        const token = generateToken(user.id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user
const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
const logout = async (req, res) => {
    try {
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getMe, logout };