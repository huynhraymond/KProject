
var router = require('express').Router();
var ImageBlob = require('../models/gallery_model');
var Calendar = require('../models/calendar_model');

// require for faster upload file
var multer = require('multer');

router.use(multer({ dest: './public/img/uploads/' }));

router.post('/uploadImage', function(req, res) {
    var imgObj = {
        name: req.body.name,
        category: req.body.category,
        img: req.files.path,
        description: req.body.description
    };

    var info = [];
    if (!Array.isArray(req.files.data)) {
        info.push(req.files.data.name);
    } else {
        info = req.files.data.map(function (file) {
            return file.name;
        });
    }

    res.status(201).json(info);
    /*
    (new ImageBlob(imgObj)).save( function(err, result) {
        if(err) {
            res.status(500).json(err);
        }

        else {
            // created success
            res.status(201).json(result);
        }
    });     */
});

router.post('/newevent', function(req, res) {
    console.log('Backend: ', req.body)
    (new Calendar(req.body)).save(function(err, result) {
        if (err) res.status(500).json(err);

        else res.status(201).json(result);
    });
});

router.post('/event', function(req, res) {

    var calendar = new Calendar(req.body);

    calendar.save(function(err, result) {
        if ( err) res.status(500).json(err);
        else res.status(201).json(result);
    });
});

router.get('/allevents', function(req, res) {
    Calendar.find( {}, function(err, result) {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
    });
});

module.exports = router;
