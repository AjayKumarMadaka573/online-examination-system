const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
  examId: {
    type: String,
    required: true,
    unique: true
  },
  teacherId: {
    type: String,
    required: true,
  },
  examNumber: {
    type: Number,
    required: true
  },
  year: {
    type:String,
    required:true
  },
  batch: {
    type:String,
    required:true
  },
  subject: {
    type:String,
    required:true
  },
  examType: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  examTime: {
    type: String,
    required: true
  },
  examQuestions: {
    type: Array,
    required: true
  },
  examChoiceQuestions: {
    type: Array,
    required: true
  }
  ,
  examBits: {
    type: Array
  },
  examBitsChoices: {
    type: Array
  }
});

module.exports = mongoose.model('Exam', examSchema);
