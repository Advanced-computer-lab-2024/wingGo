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
  description: {
    type: String,
    required: false
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
    ref: 'Advertiser',
    required: true
  },
  ratings: [
    {
      touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
  comments: [
    {
      touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
      comment: { type: String, required: true }
    }
  ],
  sales: {
    type: Number,
    default: 0, // Tracks the total number of sales for this activity
  },
  numberOfPeople: {
    type: Number,
    default: 1, // Default to 1 person
  },
flagged: {
  type: Boolean,
  default: false,  // Initially not flagged
},
touristIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],
averageRating: { type: Number, default: 0 }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;