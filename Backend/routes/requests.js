const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  getMyTasks, 
  getRequestById,
  assignTechnician,
  updateStatus,
  getStats,      
  addComment     
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../middleware/upload'); // ← use your upload middleware

// All routes require authentication
router.use(protect);

// Otherwise Express thinks "stats" and "my-requests" are an :id parameter!
router.get('/stats',       getStats);
router.get('/my-requests', getMyRequests);

// General routes
router.get('/',    authorize('admin', 'technician'), getAllRequests);
router.get('/:id', getRequestById);

// Create request — with photo upload
router.post('/', upload.single('photo'), createRequest);

// Update routes
router.put('/:id/assign',   authorize('admin'), assignTechnician);
router.put('/:id/status',   updateStatus);
router.post('/:id/comment', addComment);
router.get('/my-tasks', getMyTasks);

module.exports = router;