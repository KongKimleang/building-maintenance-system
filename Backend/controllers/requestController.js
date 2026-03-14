const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');


const createNotification = async (userId, type, title, message, requestId) => {
  try {
    await Notification.create({ userId, type, title, message, requestId });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (Resident, Staff)
const createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      floor,
      unit
    } = req.body;

    // Create location string
    const location = `Unit ${unit} - Floor ${floor}`;

    // Handle file upload
    let photoData = null;
    if (req.file) {
      photoData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const count = await Request.countDocuments();
    const requestId = `#${String(count + 1).padStart(3, "0")}`;

    // Create request
    const request = await Request.create({
      requestId,
      title,
      description,
      category,
      priority,
      floor,
      unit,
      location,
      submittedBy: req.user.id, // From auth middleware
      timeline: [{
        type: 'created',
        user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
        action: 'Submitted maintenance request',
        note: 'Initial request submitted',
        timestamp: new Date()
      }],
      ...(photoData && { photo: photoData })
    });
    
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        'new_request',
        'New Maintenance Request',
        `${req.user.firstName} submitted: ${request.title}`,
        request._id
      );
    }

    // Populate submittedBy details
    await request.populate('submittedBy', 'firstName lastName email phone unit');

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin, Technician)
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('submittedBy', 'firstName lastName email phone unit')
      .populate('assignedTo', 'firstName lastName specialization')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my requests (current user)
// @route   GET /api/requests/my-requests
// @access  Private (Resident, Staff)
const getMyRequests = async (req, res) => {
  try {
    const { status, priority, category, search, assignedTo } = req.query;
    
    let filter = {};
    if (status)     filter.status = status;
    if (priority)   filter.priority = priority;
    if (category)   filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requestId:   { $regex: search, $options: 'i' } },
        { unit:        { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await Request.find(filter)
      .populate('submittedBy', 'firstName lastName email phone unit floor')
      .populate('assignedTo', 'firstName lastName specialization phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email phone unit role')
      .populate('assignedTo', 'firstName lastName specialization phone email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      request
    });

  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign technician to request
// @route   PUT /api/requests/:id/assign
// @access  Private (Admin)
const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({ message: 'Invalid technician' });
    }

    request.assignedTo = technicianId;
    request.status = 'Assigned';
    request.timeline.push({
      type: 'assigned',
      user: 'Admin',
      action: `Assigned to ${technician.firstName} ${technician.lastName} (${technician.specialization})`,
      note: `${request.priority} priority - needs attention`,
      timestamp: new Date()
    });

    await request.save();
    // Notify technician
    await createNotification(
      technicianId,
      'assigned',
      'New Task Assigned',
      `You have been assigned: ${request.title}`,
      request._id
    );

    // Notify resident
    await createNotification(
      request.submittedBy,
      'assigned',
      'Request Assigned',
      `Your request "${request.title}" has been assigned to a technician`,
      request._id
    );
    await request.populate('assignedTo', 'firstName lastName specialization');

    res.status(200).json({
      success: true,
      message: 'Technician assigned successfully',
      request
    });

  } catch (error) {
    console.error('Assign technician error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Technician, Admin)
const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    
    if (status === 'Completed') {
      request.completedDate = new Date();
    }

    request.timeline.push({
      type: 'status_update',
      user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
      action: `Changed status to "${status}"`,
      note: note || `Status updated to ${status}`,
      timestamp: new Date()
    });

    await request.save();
    await createNotification(
      request.submittedBy,
      'status_update',
      'Request Status Updated',
      `Your request "${request.title}" is now: ${status}`,
      request._id
    );
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      request
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Get request statistics
// @route   GET /api/requests/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const total      = await Request.countDocuments();
    const pending    = await Request.countDocuments({ status: 'Pending' });
    const assigned   = await Request.countDocuments({ status: 'Assigned' });
    const inProgress = await Request.countDocuments({ status: 'In Progress' });
    const completed  = await Request.countDocuments({ status: 'Completed' });
    const cancelled  = await Request.countDocuments({ status: 'Cancelled' });

    // Stats by category
    const byCategory = await Request.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Stats by priority
    const byPriority = await Request.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Recent 5 requests
    const recent = await Request.find()
      .populate('submittedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total, pending, assigned,
        inProgress, completed, cancelled,
        byCategory, byPriority, recent
      }
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to request timeline
// @route   POST /api/requests/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.timeline.push({
      type: 'comment',
      user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
      action: 'Added a comment',
      note: comment,
      timestamp: new Date()
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Comment added',
      request
    });
  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Get requests assigned to logged in technician
// @route   GET /api/requests/my-tasks
// @access  Private (Technician)
const getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = { assignedTo: req.user._id };
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate('submittedBy', 'firstName lastName email phone unit floor')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  getMyTasks,
  getRequestById,
  assignTechnician,
  updateStatus,
  getStats,    
  addComment,
  createNotification   
};