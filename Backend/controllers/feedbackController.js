const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private (Resident, Staff)
const submitFeedback = async (req, res) => {
  try {
    const { requestId, rating, comment, technicianId } = req.body;

    if (!requestId || !rating) {
      return res.status(400).json({ message: 'RequestId and rating are required' });
    }

    // Check already submitted
    const existing = await Feedback.findOne({
      requestId,
      userId: req.user._id
    });
    if (existing) {
      return res.status(400).json({ message: 'You already submitted feedback for this request' });
    }

    const feedback = await Feedback.create({
      requestId,
      userId: req.user._id,
      rating,
      comment,
      technicianId
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get feedback for one request
// @route   GET /api/feedback/:requestId
// @access  Private
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      requestId: req.params.requestId
    })
      .populate('userId', 'firstName lastName')
      .populate('technicianId', 'firstName lastName specialization');

    if (!feedback) {
      return res.status(404).json({ message: 'No feedback found' });
    }

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    console.error('Get feedback error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private (Admin)
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('userId', 'firstName lastName')
      .populate('technicianId', 'firstName lastName')
      .populate('requestId', 'title requestId')
      .sort({ createdAt: -1 });

    const avgRating = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      count: feedback.length,
      avgRating,
      feedback
    });
  } catch (error) {
    console.error('Get all feedback error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  getAllFeedback
};