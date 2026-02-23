const express = require('express');
const router = express.Router();
const multer = require('multer'); // use multer for multipart/formdata

const {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  assignTechnician,
  updateStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

// Multer setup for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// All routes require authentication
router.use(protect);

// @route   POST /api/requests
router.post('/', upload.single('photo'), createRequest);

// @route   GET /api/requests
router.get('/', getAllRequests);

// @route   GET /api/requests/my-requests
router.get('/my-requests', getMyRequests);

// @route   GET /api/requests/:id
router.get('/:id', getRequestById);

// @route   PUT /api/requests/:id/assign
router.put('/:id/assign', assignTechnician);

// @route   PUT /api/requests/:id/status
router.put('/:id/status', updateStatus);

module.exports = router;