const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Info
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  
  // Role & Permissions
  role: {
    type: String,
    required: true,
    enum: ['admin', 'resident', 'staff', 'technician']
  },
  
  // For Resident
  floor: {
    type: String,
    required: function() {
      return this.role === 'resident' || this.role === 'staff';
    }
  },
  unit: {
    type: String,
    required: function() {
      return this.role === 'resident';
    }
  },
  
  // For Staff
  position: {
    type: String,
    required: function() {
      return this.role === 'staff';
    },
    enum: ['Receptionist', 'Security', 'Housekeeper']
  },
  
  // For Technician
  specialization: {
    type: String,
    required: function() {
      return this.role === 'technician';
    },
    enum: ['Plumber', 'Electrician', 'HVAC Technician', 'Carpenter', 'General Maintenance']
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  requirePasswordChange: {
    type: Boolean,
    default: true
  },
  
  // Tracking
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const User = mongoose.model('User', userSchema);

module.exports = User;