const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    pictures: {
        type: [String],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    openingHours: {
        type: String,
        required: true
    },
    ticketPrices: {
        foreigner: {
            type: Number,
            required: true
        },
        native: {
            type: Number,
            required: true
        },
        student: {
            type: Number,
            required: true
        }
    },tags: {
        type: [String],  // Array to store tags
        default: []
    }
}, { timestamps: true });

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;