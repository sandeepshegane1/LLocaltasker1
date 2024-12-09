import express from 'express';
import Task from '../models/Task.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      client: req.user._id,
      status: 'OPEN'
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get tasks for provider
router.get('/provider', auth, async (req, res) => {
  try {
    const { category, lat, lng, status } = req.query;
    
    const query = {
      // Remove status hardcoding, use dynamic status if provided
      status: status || 'OPEN',
      // Use category filtering if provided
      ...(category && { category }),
    };

    // Geospatial filtering - only apply if both lat and lng are provided
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

    // Modify query to match provider's services
    // Assuming req.user.services is an array of service categories
    if (req.user.services && req.user.services.length > 0) {
      query.category = { $in: req.user.services };
    }

    const tasks = await Task.find(query)
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Provider tasks fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks', 
      details: error.message 
    });
  }
});
// Get tasks for client
router.get('/client', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ client: req.user._id })
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { client: req.user._id },
        { provider: req.user._id }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'provider'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      status: 'OPEN'
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or cannot be rejected' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;