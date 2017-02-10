var express = require('express');
var wsiv = require('./wsiv');

var app = express();

app.on('mount', () => {
    console.log('app mounted');
});

app.get('/about', (req, res, next) => {
    wsiv.getVersion()
        .then((version) => {
            res.send({ version });
        });
});

app.get('/stations/id', (req, res, next) => {
    if (!req.query.q) {
        res.sendStatus(404);
        return;
    }

    wsiv.getStations({ station: { id: req.query.q }})
        .then((stations) => {
            res.send(stations);
        });
});

app.get('/stations/line', (req, res, next) => {
    if (!req.query.q) {
        res.sendStatus(404);
        return;
    }

    wsiv.getStations({ station: { line: { id: req.query.q }}})
        .then((stations) => {
            res.send(stations);
        });
});

app.get('/stations/name', (req, res, next) => {
    if (!req.query.q) {
        res.sendStatus(404);
        return;
    }

    const name = req.query.q.replace(/\s/g, ' and ');
    wsiv.getStations({ station: { name }})
        .then((stations) => {
            res.send(stations);
        });
});

app.get('/stations/geopoint', (req, res) => {
    res.send(501);
});

app.get('/lines/id/:id', (req, res) => {
    wsiv.getLines({ line: { id: req.params.id }})
        .then((lines) => {
            res.send(lines);
        });
});

module.exports = (options) => {
    wsiv.init(options);
    return app;
};