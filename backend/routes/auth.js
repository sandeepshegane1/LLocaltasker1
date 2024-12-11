import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, services, location } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Handle location data
    let userLocation = { type: 'Point', coordinates: [0, 0] }; // Default location
    if (location) {
      if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
        userLocation = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        };
        console.log(`Location data received: Latitude = ${location.latitude}, Longitude = ${location.longitude}`);
      } else {
        console.log('Invalid location data format. Expected numbers for latitude and longitude.');
      }
    } else {
      console.log('Missing location data. Using default location.');
    }

    // Create a new user instance
    const user = new User({
      email,
      password,
      name,
      role,
      location: userLocation,
      skills: Array.isArray(services) ? services : []
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token validity period
    });

    // Return all user details (except password) and the token
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token validity period
    });
    
    // Return all user details (except password) and the token
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});


export default router;