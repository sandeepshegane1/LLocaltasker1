// import mongoose from "mongoose";
// import validator from "validator";

// const serviceProviderSchema = new mongoose.Schema({
//   // Professional Identity
//   professionalProfile: {
//     name: {
//       firstName: { 
//         type: String, 
//         required: [true, "First name is mandatory"],
//         trim: true
//       },
//       lastName: { 
//         type: String, 
//         trim: true 
//       }
//     },
//     contactDetails: {
//       phone: {
//         primary: {
//           type: String,
//           required: [true, "Primary contact number is mandatory"],
//           validate: {
//             validator: function(v) {
//               return /^(\+91)?[6-9]\d{9}$/.test(v);
//             },
//             message: "Invalid Indian mobile number"
//           }
//         }
//       },
//       email: {
//         type: String,
//         required: [true, "Email is mandatory"],
//         unique: true,
//         lowercase: true,
//         validate: [validator.isEmail, "Invalid email format"]
//       }
//     }
//   },

//   // Service Expertise
//   serviceExpertise: {
//     primarySpecialization: {
//       type: String,
//       required: true,
//       enum: [
//         "Agricultural Machinery",
//         "Irrigation Services",
//         "Crop Protection",
//         "Soil Management",
//         "Seed Supply",
//         "Fertilizer Distribution",
//         "Pest Control",
//         "Agricultural Consulting",
//         "Harvesting Services",
//         "Transportation",
//         "Cold Storage Management"
//       ]
//     },
//     supportedCropTypes: [{
//       type: String,
//       enum: [
//         "Rice", "Wheat", "Maize", 
//         "Cotton", "Sugarcane", "Pulses", 
//         "Vegetables", "Fruits", "Spices"
//       ]
//     }]
//   },

//   // Service Offerings
//   services: [{
//     serviceName: {
//       type: String,
//       required: [true, "Service name is mandatory"]
//     },
//     description: {
//       type: String,
//       required: [true, "Service description is mandatory"]
//     },
//     pricingModel: {
//       basePrice: {
//         type: Number,
//         required: [true, "Base price is mandatory"]
//       },
//       priceUnit: {
//         type: String,
//         enum: ["per acre", "per hour", "per service", "per kg", "fixed"]
//       }
//     },
//     serviceArea: {
//       radius: { type: Number }, // in kilometers
//       districts: [String],
//       states: [String]
//     },
//     availability: {
//       daysAvailable: [{
//         type: String,
//         enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//       }],
//       seasonalAvailability: {
//         startMonth: { type: String },
//         endMonth: { type: String }
//       }
//     }
//   }],

//   // Equipment and Resources
//   resources: {
//     machineryOwned: [{
//       type: {
//         type: String,
//         enum: [
//           "Tractor", 
//           "Harvester", 
//           "Sprayer", 
//           "Plougher", 
//           "Thresher",
//           "Seed Drill",
//           "Irrigation Pump"
//         ]
//       },
//       model: { type: String },
//       manufacturingYear: { type: Number },
//       condition: {
//         type: String,
//         enum: ["Excellent", "Good", "Average", "Needs Repair"]
//       }
//     }],
//     additionalEquipment: [String]
//   },

//   // Business Credentials
//   businessCredentials: {
//     registrationType: {
//       type: String,
//       enum: ["Individual", "Partnership", "Private Limited", "Cooperative"]
//     },
//     businessRegistrationNumber: { type: String }
//   },

//   // Performance and Reputation
//   performanceMetrics: {
//     totalServicesProvided: { 
//       type: Number, 
//       default: 0 
//     },
//     averageRating: {
//       type: Number,
//       min: 0,
//       max: 5,
//       default: 0
//     },
//     reviews: [{
//       clientId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Farmer' 
//       },
//       rating: {
//         type: Number,
//         min: 1,
//         max: 5
//       },
//       comment: { type: String },
//       dateOfReview: { 
//         type: Date, 
//         default: Date.now 
//       }
//     }]
//   },

//   // Account Management
//   accountStatus: {
//     registeredAt: {
//       type: Date,
//       default: Date.now
//     },
//     lastActiveAt: {
//       type: Date,
//       default: Date.now
//     }
//   }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// export default mongoose.model("ServiceProvider", serviceProviderSchema);

import mongoose from "mongoose";
import validator from "validator";

const farmerSchema = new mongoose.Schema({
  // Role
  role: {
    type: String,
    enum: ['FARMER'],
    required: [true, "Role is required"]
  },

  // Professional Identity
  professionalProfile: {
    name: {
      firstName: { 
        type: String, 
        required: [true, "First name is mandatory"],
        trim: true
      },
      lastName: { 
        type: String, 
        trim: true 
      }
    },
    contactDetails: {
      phone: {
        primary: {
          type: String,
          required: [true, "Primary contact number is mandatory"],
          validate: {
            validator: function(v) {
              return /^(\+91)?[6-9]\d{9}$/.test(v);
            },
            message: "Invalid Indian mobile number"
          }
        }
      },
      email: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email format"]
      }
    }
  },

  // Password (hashed)
  password: {
    type: String,
    required: [true, "Password is required"]
  },

  // Service Expertise
  serviceExpertise: {
    primarySpecialization: {
      type: String,
      required: true,
      enum: [
        "Agricultural Machinery",
        "Irrigation Services",
        "Crop Protection",
        "Soil Management",
        "Seed Supply",
        "Fertilizer Distribution",
        "Pest Control",
        "Agricultural Consulting",
        "Harvesting Services",
        "Transportation",
        "Cold Storage Management"
      ]
    },
    supportedCropTypes: [{
      type: String,
      enum: [
        "Rice", "Wheat", "Maize", 
        "Cotton", "Sugarcane", "Pulses", 
        "Vegetables", "Fruits", "Spices"
      ]
    }]
  },

  // Service Offerings
  services: [{
    serviceName: {
      type: String,
      required: [true, "Service name is mandatory"]
    },
    description: {
      type: String,
      required: [true, "Service description is mandatory"]
    },
    serviceArea: {
      districts: [String],
      states: [String]
    },
    availability: {
      daysAvailable: [{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      }],
      seasonalAvailability: {
        startMonth: { type: String },
        endMonth: { type: String }
      }
    }
  }],

  // Equipment and Resources
  resources: {
    machineryOwned: [{
      type: {
        type: String,
        enum: [
          "Tractor", 
          "Harvester", 
          "Sprayer", 
          "Plougher", 
          "Thresher",
          "Seed Drill",
          "Irrigation Pump"
        ]
      },
      model: { type: String },
      manufacturingYear: { type: Number },
      condition: {
        type: String,
        enum: ["Excellent", "Good", "Average", "Needs Repair"]
      }
    }],
    additionalEquipment: [String]
  },

  // Business Credentials
  businessCredentials: {
    registrationType: {
      type: String,
      enum: ["Individual", "Partnership", "Private Limited", "Cooperative"]
    },
    businessRegistrationNumber: { type: String }
  },

  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { 
  timestamps: true
});

// Add index for geospatial queries
farmerSchema.index({ location: '2dsphere' });

const Farmers = mongoose.model('Farmers', farmerSchema);
export default Farmers;

