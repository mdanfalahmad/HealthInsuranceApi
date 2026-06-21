const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Auth routes (public)
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

// User routes (protected)
router.get('/users', verifyToken, userController.getAllUsers);
router.get('/users/active', verifyToken, userController.getActiveUsers);
router.get('/users/role/:role', verifyAdmin, userController.getUsersByRole);
router.get('/users/:id', verifyToken, userController.getUserById);
router.put('/users/:id', verifyToken, userController.updateUser);
router.delete('/users/:id', verifyAdmin, userController.deleteUser);

// Health check (public)
router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

module.exports = router;
