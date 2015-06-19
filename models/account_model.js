
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

//var Account = new Schema({});

var Account = new Schema({
    name: {
        type: String,
        required: true
    },

    tel: {
        type: Number,
        required: true
    },

    passcode: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }
});


Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);