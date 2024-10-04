// models/Itinerary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    tourGuideId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true },
    title: { type: String, required: true },
    activities: { type: String, required: true },
    locations: [{
        address: { type: String, required: true },
        lat: { type: Number },  // Latitude from Nominatim
        lng: { type: Number }   // Longitude from Nominatim
    }],
    timeline: { type: String, required: true },
    duration: { type: String, required: true },
    language: { type: String, required: true },
    price: { type: Number, required: true },
    availableDates: [{ type: Date, required: true }],
    accessibility: { type: Boolean, default: false },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    bookings: { type: Number, default: 0 }
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;