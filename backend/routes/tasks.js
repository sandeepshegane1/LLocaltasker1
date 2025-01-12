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

// Get user tasks - specific route should come before parameterized routes
router.get('/user-tasks', auth, async (req, res) => {
  try {
    console.log('Fetching tasks for user:', req.user._id);

    const tasks = await Task.find({
      client: req.user._id,
      $or: [
        { status: { $ne: 'CANCELLED' } },
        { status: 'CANCELLED', rejectedByProvider: true }
      ]
    })
    .populate({
      path: 'provider',
      select: '_id name',
      match: { _id: { $exists: true } }
    })
    .select('title description status category provider createdAt rejectedByProvider')
    .lean()
    .sort({ createdAt: -1 });
    
    const transformedTasks = tasks.map(task => ({
      ...task,
      provider: task.provider || null,
      category: task.category || 'General'
    }));

    console.log('Found tasks:', transformedTasks.map(t => ({
      id: t._id,
      provider: t.provider,
      category: t.category,
      status: t.status
    })));

    res.json(transformedTasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reject a task (for service providers)
router.post('/reject-task/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, provider: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or you are not the assigned provider' });
    }
    
    task.status = 'CANCELLED';
    task.rejectedByProvider = true;
    await task.save();
    
    res.json({ message: 'Task rejected successfully', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      client: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks (you might want to add pagination here)
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single task by ID - this should come after specific routes
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching task with ID:', req.params.id);
    console.log('User ID:', req.user._id);

    // Validate task ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const task = await Task.findById(req.params.id)
      .populate('provider', '_id name')
      .select('title description status category provider client createdAt rejectedByProvider')
      .lean();

    console.log('Found task:', task);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Transform task to ensure all required fields are present
    const transformedTask = {
      ...task,
      provider: task.provider || null,
      category: task.category || 'General'
    };

    console.log('Sending transformed task:', transformedTask);
    res.json(transformedTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task details' });
  }
});

// Update a task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'status', 'budget', 'location', 'category', 'priority'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, client: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, client: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get completed tasks count for provider
router.get('/provider/:providerId/completed', auth, async (req, res) => {
  try {
    const count = await Task.countDocuments({
      provider: req.params.providerId,
      status: 'COMPLETED'
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get completed tasks count for a provider
router.get('/provider/:providerId/completed-count', async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const { category } = req.query;

    const query = {
      provider: providerId,
      status: 'COMPLETED'
    };

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    const count = await Task.countDocuments(query);
    res.json({ count });
  } catch (error) {
    console.error('Error getting completed tasks count:', error);
    res.status(500).json({ error: 'Failed to get completed tasks count' });
  }
});

export default router;