const express    = require("express");
const router     = express.Router();
const uc         = require("../controllers/userController");
const { protect }    = require("../middleware/auth");
const { authorize }  = require("../middleware/roleCheck");

router.get("/",      protect, authorize("admin"), uc.getAllUsers);
router.get("/:id",   protect, authorize("admin"), uc.getUser);
router.put("/:id",   protect, authorize("admin"), uc.updateUser);
router.delete("/:id",protect, authorize("admin"), uc.deleteUser);

module.exports = router;