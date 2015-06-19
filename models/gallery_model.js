
var mongoose = require('mongoose');

var GalleryModel = mongoose.model('gallery', {
    name: String,
    category: [],
    img : String,
    description: String
});

module.exports = GalleryModel;
