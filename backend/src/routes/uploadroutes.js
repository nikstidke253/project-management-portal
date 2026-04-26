const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth.middleware');
const { User } = require('../models');

const router = express.Router();

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 2MB
    fileFilter: fileFilter
});

// @desc    Upload avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // Update user's avatar in database
        const user = await User.findByPk(req.user.id);
        user.avatar = avatarUrl;
        await user.save();

        res.json({
            success: true,
            avatarUrl: avatarUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
