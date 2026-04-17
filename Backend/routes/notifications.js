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
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MUST be before /:id
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create sample notifications for current user (testing helper)
router.post('/seed', async (req, res) => {
  try {
    const samples = [
      {
        userId: req.user._id,
        type: 'new_request',
        title: 'New Maintenance Request',
        message: 'A new maintenance request was submitted in your area.',
      },
      {
        userId: req.user._id,
        type: 'assigned',
        title: 'Task Assigned',
        message: 'A request has been assigned and needs your attention.',
      },
      {
        userId: req.user._id,
        type: 'status_update',
        title: 'Status Updated',
        message: 'A request status was updated recently.',
      },
      {
        userId: req.user._id,
        type: 'comment',
        title: 'New Comment',
        message: 'Someone added a comment on a maintenance request.',
      },
      {
        userId: req.user._id,
        type: 'completed',
        title: 'Request Completed',
        message: 'A maintenance request has been marked as completed.',
      },
    ];

    const created = await Notification.insertMany(samples);

    res.status(201).json({
      success: true,
      message: 'Sample notifications created',
      count: created.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
