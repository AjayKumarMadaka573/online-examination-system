const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const midResultsSchema = new Schema({
    studentId: {
        type: String,
        required: true,
      },
    midNumber: {
        type: Number,
        required: true,
    },
    subjects: {
        type:Array,
    },
    marks: {
        type: Array,
    }
});

module.exports = mongoose.model('MidResults', midResultsSchema);