const mongoose = require('mongoose');

// Define the schema for an activity
const activitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
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
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  specialDiscounts: {
    type: String,
    default: ''
  },
  bookingOpen: {
    type: Boolean,
    default: true
  }
});

Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;