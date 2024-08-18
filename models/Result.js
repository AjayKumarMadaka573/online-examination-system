const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultsSchema = new Schema({
  studentId: {
    type: String,
    required: true,

  },
 semester: {
    type: String,
    required: true,
 },
 results: {
    type: Object,
    required: true
 }
});

module.exports = mongoose.model('Result', resultsSchema);
