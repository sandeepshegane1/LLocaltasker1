// import express from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs'
// const router = express.Router();
// import Farmers from '../models/Farmers.js';

// // Helper function to generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '7d' // Token validity period
//   });
// };

// // Helper function to sanitize user response (remove sensitive info)
// const sanitizeUserResponse = (user) => {
//   const userObject = user.toObject();
//   delete userObject.password;
//   return userObject;
// };

// router.post('/register', async (req, res) => {
//   try {
//     const { 
//       email, 
//       password, 
//       name, 
//       role, 
//       services, 
//       location 
//     } = req.body;

//     // Validate required fields
//     if (!email || !password || !name || !role) {
//       return res.status(400).json({ error: 'All required fields must be provided' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email is already registered' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Prepare location data
//     let userLocation = { 
//       type: 'Point', 
//       coordinates: [0, 0] 
//     };

//     if (location && 
//         typeof location.latitude === 'number' && 
//         typeof location.longitude === 'number') {
//       userLocation = {
//         type: 'Point',
//         coordinates: [location.longitude, location.latitude]
//       };
//     }

//     // Create new user
//     const user = new User({
//       email,
//       password: hashedPassword,
//       name,
//       role,
//       location: userLocation,
//       skills: Array.isArray(services) ? services : []
//     });

//     // Save user to database
//     await user.save();

//     // Generate JWT token
//     const token = generateToken(user._id);

//     // Respond with user details and token
//     res.status(201).json({ 
//       user: sanitizeUserResponse(user), 
//       token 
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ 
//       error: 'Registration failed', 
//       details: error instanceof Error ? error.message : 'Unknown error' 
//     });
//   }
// });










// router.post('/farmerregister', async (req, res) => {
//    try {
//      console.log("Entering farmer registration route");
//      console.log("Received request body:", JSON.stringify(req.body, null, 2));

//      const { 
//        password,
//        professionalProfile,
//        serviceExpertise,
//        services,
//        resources,
//        businessCredentials,
//        location
//      } = req.body;

//      // Validate password
//      if (!password) {
//        return res.status(400).json({ 
//          error: 'Password is required',
//          details: 'Password must be provided during registration' 
//        });
//      }
// console.log("passwords:", JSON.stringify(password))
//      // Validate password strength
//      if (password.length < 6) {
//        return res.status(400).json({ 
//          error: 'Weak Password',
//          details: 'Password must be at least 6 characters long' 
//        });
//      }

//      // Check if user already exists
//      const existingUser = await Farmer.findOne({
//        'professionalProfile.contactDetails.email': professionalProfile.contactDetails.email
//      });

//      if (existingUser) {
//        return res.status(400).json({ 
//          error: 'Registration Failed',
//          details: 'Email is already registered' 
//        });
//      }

//      // Prepare data for registration
//      const cleanedServices = services.map(service => ({
//        ...service,
//        pricingModel: {
//          basePrice: service.pricingModel?.basePrice || 0,
//          priceUnit: service.pricingModel?.priceUnit || 'per service'
//        }
//      }));

//      // Create new farmer
//      const newFarmer = new Farmer({
//        password,
//        professionalProfile,
//        serviceExpertise: {
//          ...serviceExpertise,
//          supportedCropTypes: serviceExpertise.supportedCropTypes || []
//        },
//        services: cleanedServices,
//        resources: {
//          machineryOwned: resources?.machineryOwned || [],
//          additionalEquipment: resources?.additionalEquipment || []
//        },
//        businessCredentials,
//        location
//      });

//      // Save the new farmer
//      await newFarmer.save();

//      // Generate JWT token
//      const token = jwt.sign(
//        { 
//          userId: newFarmer._id,
//          role: 'FARMER'
//        },
//        process.env.JWT_SECRET,
//        { expiresIn: '7d' }
//      );

//      // Prepare response (remove sensitive information)
//      const userResponse = newFarmer.toObject();
//      delete userResponse.password;

//      // Send response
//      res.status(201).json({
//        message: 'Farmer registered successfully',
//        user: userResponse,
//        token
//      });

//    } catch (error) {
//      console.error('Farmer Registration Error:', error);
     
//      // More detailed error handling
//      if (error.name === 'ValidationError') {
//        const errorMessages = Object.values(error.errors).map(err => err.message);
//        return res.status(400).json({
//          error: 'Validation Failed',
//          details: errorMessages
//        });
//      }

//      res.status(500).json({
//        error: 'Registration failed',
//        details: error instanceof Error ? error.message : 'Unknown error'
//      });
//    }
// });


// // Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).json({ error: 'Invalid login credentials' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d' // Token validity period
//     });

//     // Return all user details (except password) and the token
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.json({ user: userResponse, token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'An error occurred during login' });
//   }
// });


// export default router;








import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Farmers from '../models/Farmers.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token validity period
  });
};

// Helper function to sanitize user response (remove sensitive info)
const sanitizeUserResponse = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// Regular user registration
router.post('/register', async (req, res) => {
  try {
    console.log('Entering regular user registration route');
    const { 
      email, 
      password, 
      name, 
      role, 
      services, 
      location 
    } = req.body;

    console.log('Received registration data:', { email, name, role, services, location });

    // Validate required fields
    if (!email || !password || !name || !role) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already registered');
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare location data
    let userLocation = { 
      type: 'Point', 
      coordinates: [0, 0] 
    };

    if (location && 
        typeof location.latitude === 'number' && 
        typeof location.longitude === 'number') {
      userLocation = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      };
    }

    console.log('Prepared user location:', userLocation);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      location: userLocation,
      skills: Array.isArray(services) ? services : []
    });

    console.log('Created new user object:', user);

    // Save user to database
    await user.save();
    console.log('User saved successfully');

    // Generate JWT token
    const token = generateToken(user._id, role);

    // Respond with user details and token
    console.log('Registration successful, sending response');
    res.status(201).json({ 
      user: sanitizeUserResponse(user), 
      token 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Farmer registration
router.post('/farmerregister', async (req, res) => {
  try {
    console.log("Entering farmer registration route");
   // console.log("Received request body:", JSON.stringify(req.body, null, 2));

    const { 
      password,
      professionalProfile,
      serviceExpertise,
      services,
      resources,
      businessCredentials,
      location
    } = req.body;

    // Validate password
    if (!password) {
      console.log("Registration failed: Password not provided");
      return res.status(400).json({ 
        error: 'Password is required',
        details: 'Password must be provided during registration' 
      });
    }
    console.log("Password received:", password ? "Yes" : "No");

    // Validate password strength
    if (password.length < 6) {
      console.log("Registration failed: Password too weak");
      return res.status(400).json({ 
        error: 'Weak Password',
        details: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await Farmers.findOne({
      'professionalProfile.contactDetails.email': professionalProfile.contactDetails.email
    });

    if (existingUser) {
      console.log("Registration failed: Email already registered");
      return res.status(400).json({ 
        error: 'Registration Failed',
        details: 'Email is already registered' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Filter out empty machinery entries
    const filteredMachineryOwned = resources.machineryOwned.filter(
      machine => machine.type && machine.condition
    );

    // Create new farmer
    console.log("Creating new farmer object...");
    const newFarmer = new Farmers({
      role: 'FARMER',
      professionalProfile,
      serviceExpertise,
      services,
      resources: {
        ...resources,
        machineryOwned: filteredMachineryOwned
      },
      businessCredentials,
      location,
      password: hashedPassword
    });

    //console.log("New farmer object created:", JSON.stringify(newFarmer, null, 2));

    // Save the new farmer
    console.log("Saving new farmer to database...");
    const savedFarmer = await newFarmer.save();
    //console.log("Farmer saved successfully:", JSON.stringify(savedFarmer, null, 2));

    // Generate JWT token
    console.log("Generating JWT token...");
    const token = jwt.sign(
      { userId: savedFarmer._id, role: 'FARMER' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare response (remove sensitive information)
    console.log("Preparing response...");
    const userResponse = sanitizeUserResponse(savedFarmer);

    // Send response
    console.log("Sending successful registration response");
    res.status(201).json({
      message: 'Farmer registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Farmer Registration Error:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      console.log("Validation error messages:", errorMessages);
      return res.status(400).json({
        error: 'Validation Failed',
        details: errorMessages
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Entering login route');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Check if it's a regular user
    let user = await User.findOne({ email });
    let role = 'USER';

    // If not a regular user, check if it's a farmer
    if (!user) {
      console.log('User not found in regular users, checking farmers');
      user = await Farmers.findOne({ 'professionalProfile.contactDetails.email': email });
      role = 'FARMER';
    }

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    // Generate token
    console.log('Generating JWT token');
    const token = generateToken(user._id, role);

    // Prepare response
    const userResponse = sanitizeUserResponse(user);

    console.log('Login successful, sending response');
    res.json({ user: userResponse, token, role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

export default router;

