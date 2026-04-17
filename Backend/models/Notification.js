const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['new_request', 'assigned', 'status_update', 'completed', 'comment'],
    },
    title: {
      type: String,
      required: true,
      default: 'Notification',
    },
    message: { type: String, required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
