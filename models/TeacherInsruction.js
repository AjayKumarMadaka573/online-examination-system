const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructionSchema = new Schema({
    Date: {
        type:Date,
        required:true
    },
    teacherId:{
        type:String,
        required:true
    },
  message:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('TeacherInstruction', instructionSchema);
