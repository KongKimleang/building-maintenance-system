const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedback,
  getAllFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.post('/',          protect, submitFeedback);
router.get('/',           protect, authorize('admin'), getAllFeedback);
router.get('/:requestId', protect, getFeedback);

module.exports = router;