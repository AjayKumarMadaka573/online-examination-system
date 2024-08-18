const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    year:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    examNumber:{
        type:Number,
        required:true
    },
    batch:{
        type:String,
        required:true
    },
    data :{
        type:Array,
        required:true
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);