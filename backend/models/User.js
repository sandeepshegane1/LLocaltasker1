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
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return Array.isArray(v) && 
                 v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;      // latitude
        },
        message: props => `${props.value} is not a valid [longitude, latitude] coordinate pair!`
      }
    }
  },
}, {
  timestamps: true
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;

