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
const upload = require('../middleware/upload');

router.use(protect);

// ⚠️ SPECIFIC routes MUST be before /:id
router.get('/stats',       getStats);
router.get('/my-requests', getMyRequests);
router.get('/my-tasks',    getMyTasks);  // ← moved here!

// General routes
router.get('/',    authorize('admin', 'technician'), getAllRequests);
router.get('/:id', getRequestById);  // ← this is now AFTER specific routes

// Create
router.post('/', upload.single('photo'), createRequest);

// Update
router.put('/:id/assign',   authorize('admin'), assignTechnician);
router.put('/:id/status',   updateStatus);
router.post('/:id/comment', addComment);

module.exports = router;