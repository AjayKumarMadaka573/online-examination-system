const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentDetailsSchema = new Schema({
  studentId: {
    type: String,
    required: true,

  },
  studentName:{
    type: String,
    required: true
  },
 year: {
    type: String,
    required: true,
 },

});

module.exports = mongoose.model('StudentDetails', studentDetailsSchema);
