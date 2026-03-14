const User = require('../models/User');
const bcrypt = require('bcryptjs'); 


// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Don't send passwords
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    const updateFields = ['firstName', 'lastName', 'sex', 'email', 'phone', 'floor', 'unit', 'position', 'specialization', 'isActive'];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: await User.findById(user._id).select('-password')
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, username,
      role, phone, sex,
      floor, unit, specialization, position
    } = req.body;

    if (!firstName || !lastName || !role) {
      return res.status(400).json({ message: 'firstName, lastName and role are required' });
    }

    // Check email exists
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Generate username if not provided
    let finalUsername = username ||
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;

    // Make sure username is unique
    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) {
      finalUsername = `${finalUsername}${Math.floor(Math.random() * 100)}`;
    }

    // Temporary password
    const tempPassword = 'Password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const user = await User.create({
      firstName, lastName, email,
      username: finalUsername,
      password: hashedPassword,
      role, phone, sex,
      floor, unit, specialization, position,
      requirePasswordChange: true,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      credentials: {
        username: finalUsername,
        tempPassword,
        note: 'Give these credentials to the user. They must change password on first login.'
      },
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all technicians
// @route   GET /api/users/technicians
// @access  Private (Admin)
const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({
      role: 'technician',
      isActive: true
    }).select('-password');

    res.status(200).json({
      success: true,
      count: technicians.length,
      technicians
    });
  } catch (error) {
    console.error('Get technicians error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset user password (Admin)
// @route   PUT /api/users/:id/reset-password
// @access  Private (Admin)
const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tempPassword = 'Password123';
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(tempPassword, salt);
    user.requirePasswordChange = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      tempPassword
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser, 
  updateUser,
  deleteUser,
  getTechnicians,
  resetPassword 
};