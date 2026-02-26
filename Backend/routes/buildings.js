const express = require('express');
const router = express.Router();
const {
  getBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getUnits,
  createUnit,
  assignResident
} = require('../controllers/buildingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Building routes
router.get('/',    protect, getBuildings);
router.get('/:id', protect, getBuilding);
router.post('/',   protect, authorize('admin'), createBuilding);
router.put('/:id', protect, authorize('admin'), updateBuilding);
router.delete('/:id', protect, authorize('admin'), deleteBuilding);

// Unit routes (inside a building)
router.get('/:id/units',              protect, getUnits);
router.post('/:id/units',             protect, authorize('admin'), createUnit);
router.put('/:id/units/:unitId',      protect, authorize('admin'), assignResident);

module.exports = router;