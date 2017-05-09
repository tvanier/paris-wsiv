'use strict';

var express = require('express');
var wsiv = require('./wsiv');

var app = express();

app.on('mount', function () {
    console.log('app mounted');
});

// lower case all query parameters
app.use(function (req, res, next) {
    for (var key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});

app.get('/about', function (req, res, next) {
    wsiv.getVersion().then(function (version) {
        res.send({ version: version });
    });
});

app.get('/stations/:id', function (req, res) {
    wsiv.getStations({ id: req.params.id }).then(function (stations) {
        if (!stations || stations.length !== 1) {
            res.sendStatus(404);
            return;
        }

        res.send(stations[0]);
    }).catch(function (error) {
        res.status(500).send({ error: error });
    });
});

app.get('/stations', function (req, res) {
    var name = req.query.name;
    if (Array.isArray(req.query.name)) {
        name = req.query.name.join(' and ');
    }

    var line = { id: req.query.lineid };

    var limit = req.query.limit;
    var sortAlpha = req.query.sortalpha === '';

    wsiv.getStations({ line: line, name: name }, { limit: limit, sortAlpha: sortAlpha }).then(function (stations) {
        res.send(stations);
    }).catch(function (error) {
        res.status(500).send({ error: error });
    });
});

app.get('/lines/:id', function (req, res) {
    wsiv.getLines({ line: { id: req.params.id } }).then(function (lines) {
        res.send(lines);
    });
});

module.exports = function (options) {
    wsiv.init(options);
    return app;
};