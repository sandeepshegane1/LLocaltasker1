import express from 'express';
import Booking from '../models/Booking.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      client: req.user._id
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's bookings (as client or provider)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { client: req.user._id },
        { provider: req.user._id }
      ]
    })
    .populate('client', 'name email')
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      provider: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;