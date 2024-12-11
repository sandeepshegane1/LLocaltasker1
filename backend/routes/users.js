import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'location', 'skills'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get service providers by category
router.get('/providers', auth, async (req, res) => {
  console.log('Request received for /providers with query:', req.query);

  try {
    const { category, lat, lng } = req.query;
    
    // Validate category
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const query = {
      role: 'PROVIDER',
      // Use $in to match if category is in skills array (case-insensitive)
      skills: { 
        $in: [category.toUpperCase()] 
      }
    };

    // Optional location-based filtering
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 50000 // 50km radius
        }
      };
    }

    // Log the query for debugging
    //console.log('Providers Query:', query);

    const providers = await User.find(query)
      .select('-password')
      .limit(20);

    //console.log('Providers Found:', providers);

    res.json(providers);
  } catch (error) {
   // console.error('Providers Error:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/farmers', auth, async (req, res) => {
  try {
    console.log('Request received for /farmers with query:', req.query);

    const { category, lat, lng } = req.query;

    // Validate category
    if (!category) {
      console.log('Validation failed: Category is missing.');
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log(`Filtering farmers by category: ${category.toUpperCase()}`);

    const query = {
      role: 'PROVIDER',
      skills: { 
        $in: [category.toUpperCase()] 
      }
    };

    // Optional location-based filtering
    if (lat && lng) {
      console.log(`Applying location filter with coordinates: [${lng}, ${lat}]`);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 100000 // 100km radius
        }
      };
    }

    console.log('Query to be executed on the database:', query);

    const farmers = await User.find(query)
      .select('-password')
      .limit(20);

    console.log(`Found ${farmers.length} farmers matching the criteria.`);
    res.json(farmers);
  } catch (error) {
    console.error('Error occurred in /farmers route:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get workers by category (similar to providers)
router.get('/workers', auth, async (req, res) => {
  console.log('Request received for /workers with query:', req.query);

  try {
    const { category, lat, lng } = req.query;

    const query = {
      role: 'PROVIDER',
      skills: { $in: [category.toUpperCase()] }
    };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 50000 // 50km radius
        }
      };
    }

    //console.log('Workers Query:', query);

    const workers = await User.find(query).select('-password').limit(20);

    //console.log('Workers Found:', workers);

    res.json(workers);
  } catch (error) {
    console.error('Workers Error:', error);
    res.status(500).json({ error: error.message });
  }
});


export default router;