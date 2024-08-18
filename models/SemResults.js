const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const semResultsSchema = new Schema({
    studentId: {
        type: String,
        required: true,
      },
    examId: {
        type: String,
        required: true,
    },
    subjects: {
        type:Array,
    },
    grades: {
        type: Array,
    }
});

module.exports = mongoose.model('SemResults', semResultsSchema);