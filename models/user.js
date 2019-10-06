const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserObject = new Schema({
    firstName: {
        type:String,
        required: true
    },
    lastName : {
        type: String,
        required:  true
    },
    userName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength : 12,
    },
    history : {
        type : [ {
        heartBeat: {
            type: Number,
            default : 0
        },
        pulseRate : {
            type: Number,
            default: 0
        }
        }],
        validate : [arrayLimit, "History cannot show more than 10 records"]
    }
});

function arrayLimit(val){
    return val.length <= 10;
}
module.exports = User = mongoose.model("users",UserObject);