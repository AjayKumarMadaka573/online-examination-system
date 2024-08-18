const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attemptedExamSchema = new Schema({
    studentId: {
        type: String,
        required: true,
      },
    examId: {
        type: String,
        required: true,
    },
    answers: {
        type: Array,
        required: true
    },
    answersChoice : {
        type: Array,
        required: true
    },
    bitsAnswers: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('ExamAttempted', attemptedExamSchema);