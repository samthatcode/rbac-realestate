const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  associatedMarketer: {
    type: Schema.Types.ObjectId,
    ref: 'Marketer',
    required: true
  },
  // Other fields as needed
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
