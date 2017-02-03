/**
 * Created by vikash on 03-Feb-17.
 */
/**
 * Created by vikash on 21-Dec-16.
 */
var mongoose = require('mongoose');
var CheckPointSchema = mongoose.Schema({
    checkPointName : {
        type : String,
        required : true
    },
    latLng : {
        lat : {
            type : String,
            required : true
        },
        lng : {
            type : String,
            required : true
        }
    }

});
module.exports = mongoose.model('CheckPoint',CheckPointSchema);