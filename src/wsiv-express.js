var express = require('express');
var wsiv = require('./wsiv');

var app = express();

app.on('mount', () => {
    console.log('app mounted');
});

// lower case all query parameters
app.use(function(req, res, next) {
  for (var key in req.query) {
    req.query[key.toLowerCase()] = req.query[key];
  }
  next();
});

app.get('/about', (req, res, next) => {
    wsiv.getVersion()
        .then(version => {
            res.send({ version });
        });
});

app.get('/stations/:id', (req, res) => {
    wsiv.getStations({ id: req.params.id })
        .then((stations) => {
            if (!stations || stations.length !== 1) {
                res.sendStatus(404);
                return;
            }

            res.send(stations[0]);
        })
        .catch(error => {
            res.status(500).send({ error });
        });
});

app.get('/stations', (req, res) => {
    let name = req.query.name;
    if (Array.isArray(req.query.name)) {
        name = req.query.name.join(' and ');
    }

    let line = { id: req.query.lineid };

    const limit = req.query.limit;
    const sortAlpha = (req.query.sortalpha === '');

    wsiv.getStations({ line, name }, { limit,  sortAlpha })
        .then(stations => {
            res.send(stations);
        })
        .catch(error => {
            res.status(500).send({ error });
        })
});

app.get('/lines/:id', (req, res) => {
    wsiv.getLines({ line: { id: req.params.id }})
        .then((lines) => {
            res.send(lines);
        });
});

module.exports = (options) => {
    wsiv.init(options);
    return app;
};
