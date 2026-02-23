const mongoose = require('mongoose');


const requestSchema = new mongoose.Schema({
  // Auto-increment ID
  requestId: {
    type: String,
    unique: true,
  },
  
  // Request Details
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Appliance', 'Cleaning', 'Mechanical', 'Other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled']
  },
  
  // Location
  floor: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  
  // Users
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Photos
  photos: [{
    type: String // Store file paths
  }],
  
  // Timeline
  timeline: [{
    type: {
      type: String,
      enum: ['created', 'assigned', 'status_update', 'comment']
    },
    user: String,
    action: String,
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Dates
  completedDate: Date
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;