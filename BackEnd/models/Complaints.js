const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tourist: {
    type: Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  state: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  }
}, { timestamps: true });

const Complaints = mongoose.model('Complaints', complaintsSchema);

module.exports = Complaints;