
var mongoose = require('mongoose');

var CalendarModel = mongoose.model('calendars', {
    utc: Number,
    start: String,
    localTime: String,
    title: String,
    description: String,
    backgroundColor: String,
    textColor: String
});

/*
var CalendarModel = mongoose.model('calendar', {

    id: {
        type: String
    },

    utc: {
        type: Number
    },

    date: {
        type: String
    },

    title: {
        type: String
    },

    description: {
        type: String
    },

    backgroundColor: {
        type: String
    },

    textColor: {
        type: String
    }
});
*/

module.exports = CalendarModel;