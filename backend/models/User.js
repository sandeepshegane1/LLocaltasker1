import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['CLIENT', 'PROVIDER'],
    required: true
  },
  skills: [{
    type: String
  }],
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
}, {
  timestamps: true
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;

