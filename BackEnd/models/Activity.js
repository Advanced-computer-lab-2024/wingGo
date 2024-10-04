const mongoose = require('mongoose');


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
  }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;