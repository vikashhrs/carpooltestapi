/**
 * Created by vikash on 21-Dec-16.
 */
var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    empID : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    phone : {
        type : String
    },
    password : {
        type : String,
        required : true
    }

});
module.exports = mongoose.model('User',UserSchema);