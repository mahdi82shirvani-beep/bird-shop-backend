const express = require('express');
const router = express.Router();

const { 
  getProfile, 
  updateProfile, 
  becomeSeller,
  createUser,
  editUser,
  deleteUser
} = require('./user.controller');

const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

// ==========================================
// روت‌های عمومی (حساب کاربری خود شخص)
// ==========================================
// router.get('/profile', verifyToken, getProfile);
// router.patch('/profile', verifyToken, updateProfile);
// router.post('/become-seller', verifyToken, becomeSeller);
router.post('/', verifyToken, isAdmin, createUser);
router.patch('/:id', verifyToken, isAdmin, editUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;