const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evaluatedSchema = new Schema({
  examId: {
    type: String,
    required: true,

  },
 studentId: {
    type: String,
    required: true,
 },
 marks: {
    type: Number,
    required: true
 }
});

module.exports = mongoose.model('Evaluated', evaluatedSchema);
