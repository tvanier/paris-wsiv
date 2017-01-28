var wsiv = require('./dist/wsiv');

var options = {
    wsdlPath: __dirname + '/./Wsiv.wsdl',
    endpoint: process.env.ENDPOINT
};

wsiv.init(options)
    .then(function() {
        return wsiv.getVersion();
    })
    .then((version) => {
        console.log('got version', version);
    })
    .then(() => {
        return wsiv.getLines({ line: { id: '62' } });
    })
    .then((lines) => {
        console.log('found ' + lines.length + ' lines');
        //console.log(lines[0]);

        return wsiv.getDirections(lines[0]);
    })
    .then((directions) => {
        //console.log('directions', directions);

        return wsiv.getStations({ station: { name: 'palaiseau*' }});
    })
    .then((stations) => {
        console.log('found ' + stations.length + ' stations');

        return wsiv.getMissionsNext(stations[1], { sens: '*' });
    })
    .then((missions) => {
        console.log(`found ${missions.length} missions next`);

        missions.forEach((mission) => {
            console.log(mission.stations.map(s => s.name).join(' / ') + ' ' + mission.stationsDates);
        });

        return wsiv.getStations({ station: { name: 'antony*' }});
    })
    // .then((stations) => {
    //     return wsiv.getMissionsFrequency(stations[0]);
    // })
    // .then((missions) => {
    //     console.log(`found ${missions.length} missions frequency`);
    // })
    .catch((error) => {
        console.log('error', error);
    });
