const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  unitNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Studio', '1BR', '2BR', '3BR', 'Office', 'Other'],
    default: 'Studio'
  },
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isOccupied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Unit = mongoose.model('Unit', unitSchema);
module.exports = Unit;