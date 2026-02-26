const Building = require('../models/Building');
const Unit = require('../models/Unit');

// GET /api/buildings — Get all buildings
const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buildings.length,
      buildings
    });
  } catch (error) {
    console.error('Get buildings error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/buildings/:id — Get single building
const getBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.status(200).json({ success: true, building });
  } catch (error) {
    console.error('Get building error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/buildings — Create building (admin)
const createBuilding = async (req, res) => {
  try {
    const { name, address, totalFloors, description } = req.body;

    if (!name || !address || !totalFloors) {
      return res.status(400).json({ message: 'Name, address and floors are required' });
    }

    const building = await Building.create({
      name,
      address,
      totalFloors,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Building created successfully',
      building
    });
  } catch (error) {
    console.error('Create building error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/buildings/:id — Update building (admin)
const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Building updated',
      building
    });
  } catch (error) {
    console.error('Update building error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/buildings/:id — Soft delete (admin)
const deleteBuilding = async (req, res) => {
  try {
    await Building.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true, message: 'Building removed' });
  } catch (error) {
    console.error('Delete building error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/buildings/:id/units — Get all units in a building
const getUnits = async (req, res) => {
  try {
    const units = await Unit.find({ building: req.params.id })
      .populate('residentId', 'firstName lastName email phone')
      .sort({ floor: 1, unitNumber: 1 });

    res.status(200).json({
      success: true,
      count: units.length,
      units
    });
  } catch (error) {
    console.error('Get units error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/buildings/:id/units — Create unit in building (admin)
const createUnit = async (req, res) => {
  try {
    const { floor, unitNumber, type } = req.body;

    if (!floor || !unitNumber) {
      return res.status(400).json({ message: 'Floor and unit number are required' });
    }

    const unit = await Unit.create({
      building: req.params.id,
      floor,
      unitNumber,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      unit
    });
  } catch (error) {
    console.error('Create unit error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/buildings/:id/units/:unitId — Assign resident to unit (admin)
const assignResident = async (req, res) => {
  try {
    const { residentId } = req.body;

    const unit = await Unit.findByIdAndUpdate(
      req.params.unitId,
      {
        residentId,
        isOccupied: residentId ? true : false
      },
      { new: true }
    ).populate('residentId', 'firstName lastName email');

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Resident assigned to unit',
      unit
    });
  } catch (error) {
    console.error('Assign resident error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getUnits,
  createUnit,
  assignResident
};