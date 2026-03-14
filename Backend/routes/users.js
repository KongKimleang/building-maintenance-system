const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTechnicians,
  resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/technicians',         protect, getTechnicians);
router.get('/',                    protect, authorize('admin'), getAllUsers);
router.post('/',                   protect, authorize('admin'), createUser);
router.get('/:id',                 protect, authorize('admin'), getUserById);
router.put('/:id',                 protect, authorize('admin'), updateUser);
router.delete('/:id',              protect, authorize('admin'), deleteUser);
router.put('/:id/reset-password',  protect, authorize('admin'), resetPassword);


module.exports = router;