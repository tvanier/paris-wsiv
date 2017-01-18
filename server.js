var wsiv = require('./src/wsiv');

wsiv.getVersion()
    .then((version) => {
        console.log('got version', version);
    })
    .then(() => {
        return wsiv.getLines({ line: { id: '62' } });
    })
    .then((lines) => {
        console.log('found ' + lines.length + ' lines');
        console.log(lines[0]);

        return wsiv.getDirections(lines[0]);
    })
    .then((directions) => {
        console.log('directions', directions);

        return wsiv.getStations({ station: { name: 'palaiseau*' }});
    })
    .then((stations) => {
        console.log('found ' + stations.length + ' stations');
        //console.log(stations);

        let station = {
            id: stations[1].id,
            name: stations[1].name //,
            // line: {
            //     id: stations[1].line.id
            // }
        };
        return wsiv.getMissionsNext(station, {sens: 'A'});
    })
    .then((missions) => {
        console.log(`found ${missions.length} missions`);
        console.log(missions[0]);
    })
    .catch((error) => {
        console.log('error', error);
    });
