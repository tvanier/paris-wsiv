'use strict';

var express = require('express');
var wsiv = require('./wsiv');

var app = express();

app.on('mount', function () {
    console.log('app mounted');
});

app.get('/about', function (req, res, next) {
    wsiv.getVersion().then(function (version) {
        res.send({ version: version });
    });
});

// app.get('/stations/id/:id', (req, res, next) => {
//     wsiv.getStations({ station: { id: req.params.id }})
//         .then((stations) => {
//             res.send(stations);
//         });
// });

app.get('/stations/line', function (req, res, next) {
    if (!req.query.q) {
        res.sendStatus(404);
        return;
    }

    wsiv.getStations({ station: { line: { id: req.query.q } } }).then(function (stations) {
        res.send(stations);
    });
});

app.get('/stations/name', function (req, res, next) {
    if (!req.query.q) {
        res.sendStatus(404);
        return;
    }

    var name = req.query.q;
    if (Array.isArray(req.query.q)) {
        name = req.query.q.join(' and ');
    }

    wsiv.getStations({ station: { name: name } }).then(function (stations) {
        res.send(stations);
    }).catch(function (error) {
        res.status(500).send({ error: error });
    });
});

app.get('/stations/geopoint', function (req, res) {
    res.send(501);
});

app.get('/lines/id/:id', function (req, res) {
    wsiv.getLines({ line: { id: req.params.id } }).then(function (lines) {
        res.send(lines);
    });
});

module.exports = function (options) {
    wsiv.init(options);
    return app;
};