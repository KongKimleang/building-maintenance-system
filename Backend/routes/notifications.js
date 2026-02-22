const express      = require("express");
const router       = express.Router();
const Notification = require("../models/Notification");
const { protect }  = require("../middleware/auth");

// GET all notifications for current user
router.get("/", protect, async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT mark one as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT mark ALL as read
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;