const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  uploadProfilePhoto,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

router.post('/register', protect, authorize('admin'), registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.put('/profile-photo', protect, upload.single('photo'), uploadProfilePhoto);

module.exports = router;
