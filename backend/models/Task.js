import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'OPEN'
  },
  budget: {
    type: Number,
    required: true,
    min: [0, 'Budget must be a positive number']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Coordinates must be an array of [longitude, latitude]'
      }
    }
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  rejectedByProvider: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Geospatial indexing for location-based queries
taskSchema.index({ location: '2dsphere' });

const Task = mongoose.model('Task', taskSchema);

export default Task;
