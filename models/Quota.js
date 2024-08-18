const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quotaSchema = new Schema({
  teacherId: {
    type: String,
    required: true,
  },
  examId: {
    type: String,
    required: true,
  },
  quotaStart: {
    type: Number,
    required: true
  },
  quotaEnd: {
    type: Number,
    required: true
  },
  Completed: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Quota', quotaSchema);
