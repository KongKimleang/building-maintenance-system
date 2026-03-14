const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.use(protect);

//  read-all MUST be before /:id
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.status(200).json({ 
      success: true, 
      notifications, 
      unreadCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MUST be before /:id
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id }, 
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id, 
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
