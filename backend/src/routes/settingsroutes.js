const express = require('express');
const { changePassword, updateProfile } = require('../controllers/settingscontroller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.put('/change-password', changePassword);
router.put('/profile', updateProfile);

module.exports = router;