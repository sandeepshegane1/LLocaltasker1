// import mongoose from 'mongoose';

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   status: {
//     type: String,
//     enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
//     default: 'OPEN'
//   },
//   budget: {
//     type: Number,
//     required: true,
//     min: [0, 'Budget must be a positive number']
//   },
//   location: {
//     type: {
//       type: String,
//       default: 'Point',
//       enum: ['Point']
//     },
//     coordinates: {
//       type: [Number],
//       required: true,
//       validate: {
//         validator: function(v) {
//           return v.length === 2;
//         },
//         message: 'Coordinates must be an array of [longitude, latitude]'
//       }
//     }
//   },
//   client: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   provider: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   category: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   priority: {
//     type: String,
//     enum: ['LOW', 'MEDIUM', 'HIGH'],
//     default: 'MEDIUM'
//   },
//   rejectedByProvider: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// // Geospatial indexing for location-based queries
// taskSchema.index({ location: '2dsphere' });

// const Task = mongoose.model('Task', taskSchema);

// export default Task;
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
    enum: ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity must be a positive number']
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: [0, 'Price per unit must be a positive number']
  },
  unit: {
    type: String,
    required: true,
    enum: ['HOUR', 'DAY', 'PIECE', 'KG', 'TON', 'BUSHEL'],
    default: 'HOUR'
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
          return Array.isArray(v) && v.length === 2 && v.every(coord => typeof coord === 'number');
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
    ref: 'User',
    required: true
  },
  category: {
    type: String,
   // required: true,
    trim: true
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  quality: {
    type: String,
    enum: ['STANDARD', 'PREMIUM', 'CUSTOM'],
    default: 'STANDARD'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  rejectedByProvider: {
    type: Boolean,
    default: false
  },
  taskType: {
    type: String,
    enum: ['SERVICE', 'PRODUCT'],
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  attachments: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Geospatial indexing for location-based queries
taskSchema.index({ location: '2dsphere' });

const Task = mongoose.model('Task', taskSchema);

export default Task;

