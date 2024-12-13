import express from 'express'; // No need for Request, Response unless TypeScript
import Farmers from '../models/Farmers.js'; // Ensure .js extension is included

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmers.findById(req.params.id); // Use `Farmers` as imported
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
