const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  referringMarketerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marketer',
    required: true,
  },
  // Other fields...
});

const Registration = mongoose.model('Registration', RegistrationSchema);

module.exports = Registration;
