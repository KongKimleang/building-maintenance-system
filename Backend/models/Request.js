const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  requestId:   { type: String, unique: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Plumbing", "Electrical", "HVAC", "Carpentry", "General", "Other"]
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"]
  },
  floor:       { type: Number, required: true },
  unit:        { type: String, required: true },
  location:    { type: String },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  photos:      [{ type: String }],
  timeline: [{
    message:   { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date:      { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Auto generate #001, #002...
RequestSchema.pre("save", async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model("Request").countDocuments();
    this.requestId = `#${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Request", RequestSchema);