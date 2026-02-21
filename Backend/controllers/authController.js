const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register new user (Admin only - will add middleware later)
// @route   POST /api/auth/register
// @access  Private (Admin)
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      sex,
      email,
      phone,
      role,
      floor,
      unit,
      position,
      specialization
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate username from name
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    
    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      // Add a number if username exists
      const randomNum = Math.floor(Math.random() * 1000);
      username = `${username}${randomNum}`;
    }

    // Generate temporary password
    const tempPassword = 'Temp' + Math.random().toString(36).slice(-8);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Create user object based on role
    const userData = {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      sex,
      email,
      phone,
      role,
      requirePasswordChange: true
    };

    // Add role-specific fields
    if (role === 'resident') {
      userData.floor = floor;
      userData.unit = unit;
    } else if (role === 'staff') {
      userData.position = position;
      userData.floor = floor;
    } else if (role === 'technician') {
      userData.specialization = specialization;
    }

    // Create user
    const user = await User.create(userData);

    // Return user info and temporary password
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      credentials: {
        username: user.username,
        tempPassword: tempPassword,
        message: 'Please provide these credentials to the user. They will be required to change password on first login.'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is disabled. Please contact administrator.' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        requirePasswordChange: user.requirePasswordChange
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};