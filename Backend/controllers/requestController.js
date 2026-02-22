const Request = require("../models/Request");

// GET resident's own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ submittedBy: req.user._id })
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all requests with filters — admin and technician
exports.getAllRequests = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    let filter = {};
    if (status)   filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search)   filter.title = { $regex: search, $options: "i" };

    const requests = await Request.find(filter)
      .populate("submittedBy", "firstName lastName floor unit")
      .populate("assignedTo", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single request
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("submittedBy", "firstName lastName floor unit email")
      .populate("assignedTo", "firstName lastName phone")
      .populate("timeline.updatedBy", "firstName lastName");
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET stats for dashboard
exports.getStats = async (req, res) => {
  try {
    const total      = await Request.countDocuments();
    const pending    = await Request.countDocuments({ status: "Pending" });
    const assigned   = await Request.countDocuments({ status: "Assigned" });
    const inProgress = await Request.countDocuments({ status: "In Progress" });
    const completed  = await Request.countDocuments({ status: "Completed" });
    res.json({ total, pending, assigned, inProgress, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create new request
exports.createRequest = async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      submittedBy: req.user._id,
      timeline: [{ message: "Request submitted", updatedBy: req.user._id }]
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT assign technician — admin only
exports.assignRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: req.body.technicianId,
        status: "Assigned",
        $push: { timeline: { message: "Assigned to technician", updatedBy: req.user._id } }
      },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update status
exports.updateStatus = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        $push: {
          timeline: {
            message: req.body.message || `Status changed to ${req.body.status}`,
            updatedBy: req.user._id
          }
        }
      },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add comment to timeline
exports.addComment = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          timeline: { message: req.body.message, updatedBy: req.user._id }
        }
      },
      { new: true }
    ).populate("timeline.updatedBy", "firstName lastName");
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};