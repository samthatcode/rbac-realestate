const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Other fields...
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
