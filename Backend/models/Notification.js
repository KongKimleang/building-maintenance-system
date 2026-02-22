const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type:      { type: String, enum: ["assigned", "status_update", "completed", "comment"] },
  message:   { type: String, required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  isRead:    { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);