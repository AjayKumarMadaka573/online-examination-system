const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  examId: {
    type: String,
    required: true,

  },
 studentId: {
    type: String,
    required: true,
 },
 feedback: {
    type: String,
    required: true,
 },
 rating: {
    type: Number,
    required:true
 }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
