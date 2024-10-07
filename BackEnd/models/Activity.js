const mongoose = require('mongoose');


const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
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
    address: {
      type: String,
      required: true
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
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
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'advertiser',
    required: true
  },
  ratings: {
    type: Number, // Assuming ratings are numeric
    default: 0,   // Default rating of 0 if none is provided
    min: 0,
    max: 5       // Assuming a 5-star rating system
}
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;