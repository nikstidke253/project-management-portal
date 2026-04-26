const express = require('express');
const {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
} = require('../controllers/clientcontroller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.route('/')
    .get(authorize('admin'), getClients)
    .post(authorize('admin'), createClient);
    
router.route('/:id')
    .get(authorize('admin'), getClient)
    .put(authorize('admin'), updateClient)
    .delete(authorize('admin'), deleteClient);

module.exports = router;