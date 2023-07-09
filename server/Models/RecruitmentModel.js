const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  incentives: {
    type: String,
  },
});

const Recruitment = mongoose.model('Recruitment', RecruitmentSchema);

module.exports = Recruitment;
