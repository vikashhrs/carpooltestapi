/**
 * Created by vikash on 03-Feb-17.
 */
/**
 * Created by vikash on 21-Dec-16.
 */
var mongoose = require('mongoose');
var CheckPoint = require("./checkpoints");
var LiveRideSchema = mongoose.Schema({
    flag : {
        type : String,
        required : true
    },
    availability : {
        type : String,
        required : true
    },
    startTime : {
        type : Date,
        required : true
    },
    source : {
        type : mongoose.Schema.Types,
        ref : "CheckPoint",
        required : true
    },
    destination : {
        type : mongoose.Schema.Types,
        ref : "CheckPoint",
        required : true
    }


});
module.exports = mongoose.model('LiveRide',LiveRideSchema);