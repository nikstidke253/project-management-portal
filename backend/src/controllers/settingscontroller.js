const { User } = require('../models');

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findByPk(req.user.id);
        
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        
        const user = await User.findByPk(req.user.id);
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;
        
        await user.save();
        
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { changePassword, updateProfile };