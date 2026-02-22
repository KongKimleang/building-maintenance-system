const express    = require("express");
const router     = express.Router();
const rc         = require("../controllers/requestController");
const { protect }    = require("../middleware/auth");
const { authorize }  = require("../middleware/roleCheck");

router.get("/stats",        protect, rc.getStats);
router.get("/my-requests",  protect, rc.getMyRequests);
router.get("/",             protect, authorize("admin", "technician"), rc.getAllRequests);
router.get("/:id",          protect, rc.getRequest);
router.post("/",            protect, rc.createRequest);
router.put("/:id/assign",   protect, authorize("admin"), rc.assignRequest);
router.put("/:id/status",   protect, rc.updateStatus);
router.post("/:id/comment", protect, rc.addComment);

module.exports = router;