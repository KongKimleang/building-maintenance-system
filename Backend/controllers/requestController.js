const Request = require('../models/Request');
const User = require('../models/User');

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
    const requests = await Request.find({ submittedBy: req.user.id })
      .populate('assignedTo', 'firstName lastName specialization phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error('Get my requests error:', error);
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

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  assignTechnician,
  updateStatus
};