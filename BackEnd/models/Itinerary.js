// models/Itinerary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    tourGuideId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true },
    title: { type: String, required: true },
    tags: [String],
    activities: { type: String, required: true },
    locations: [{ type: String, required: true }],
    timeline: { type: String, required: true },
    duration: { type: String, required: true },
    language: { type: String, required: true },
    price: { type: Number, required: true },
    availableDates: [{ type: Date, required: true }],
    accessibility: { type: Boolean, default: false },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    bookings: { type: Number, default: 0 },
    ratings: {
        type: Number, // Assuming ratings are numeric
        default: 0,   // Default rating of 0 if none is provided
        min: 0,
        max: 5       // Assuming a 5-star rating system
    },
    flagged: {
        type: Boolean,
        default: false,  // Initially not flagged
      },
  touristIDs: [{
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
    bookingDate: { type: Date} // Default to the current date
}]
}, { timestamps: true });


const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;