
'use strict';

var soap = require('strong-soap').soap;

const defaults = {
    wsdlPath: './Wsiv.wsdl',
    logger: {
        log: console.log.bind(console, 'wsiv')
    }
};

let soapClient;
let logger = defaults.logger;

const init = (params = defaults) => {
    if (soapClient) {
        return Promise.resolve(soapClient);
    }

    logger = params.logger;

    return new Promise((resolve, reject) => {
        soap.createClient(params.wsdlPath, {}, function(error, client) {
            if (error) {
                logger.log('init error', { error });
                reject(error);
                return;
            }

            logger.log('init success');
            logger.log(client.describe());
            soapClient = client;
            resolve(client);
        });
    });
}

const callApiMethod = (method, methodArgs) => {
    logger.log(method, methodArgs);

    return init().then((client) => {
        return new Promise((resolve, reject) => {
            client.Wsiv.WsivSOAP11port_http[method](methodArgs, (error, result) => {
                if (error) {
                    logger.log(method + ' error', { error });
                    reject(error);
                    return;
                }

                resolve(result);
            });
        })
        .catch((error) => {
            logger.log(method + ' error', { error });
            throw error;
        });
    });
};

const getVersion = () => {
    return callApiMethod('getVersion')
        .then((result) => {
            let version = result ? result.return : 'unknown';
            logger.log('getVersion success', { version });
            return version;
        });
};

const getLines = (filter = null) => {
    return callApiMethod('getLines', filter)
        .then((result) => {
            let lines = result ? result.return : [];
            logger.log('getLines success', { filter, linesCount: lines.length });
            return lines;
        });
};

const getDirections = (line) => {
    return callApiMethod('getDirections', { line })
        .then((result) => {
            let directions = result ? result.return : {};
            logger.log('getLines success', { line, directions });
            return directions;
        });
};

const getStations = (filter = null) => {
    return callApiMethod('getStations', filter)
        .then((result) => {
            let stations = result ? result.return.stations : [];
            logger.log('getStations success', { filter, stationsCount: stations.length });
            return stations;
        });
};

// const getStationAreas = (filter = null) => {
//     return callApiMethod('getStationAreas', filter)
//         .then((result) => {
//             let stationAreas = result ? result.return.stationAreas : [];
//             logger.log('getStationAreas success', { filter, stationAreasCount: stations.length });
//             return stationAreas;
//         });
// };

const getMissionsNext = (station, direction) => {
    let methodArgs = {
        station: {
            id: station.id,
            name: station.name
        },
        direction
    };

    return callApiMethod('getMissionsNext', methodArgs)
        .then((result) => {
            if (result.return && result.return.ambiguityMessage) {
                throw new AmbiguityError(result.ambiguityMessage, result);
            }

            let missions = result ? result.return.missions : [];
            logger.log('getMissionsNext response', { missionsCount: missions.length })
            return missions;
        });
};

const getMissionsFrequency = (station) => {
    let methodArgs = {
        station: {
            id: station.id,
            name: station.name
        }
    };

    return callApiMethod('getMissionsFrequency', methodArgs)
        .then((result) => {
            if (result && result.ambiguityMessage) {
                throw new AmbiguityError(result.ambiguityMessage, result);
            }

            let missions = result ? result.return : [];
            logger.log('getMissionsFrequency response', { missionsCount: missions.length })
            return missions;
        });
};

function AmbiguityError(message, params = {}) {
    this.message = message;
    this.ambiguousLines = params.ambiguousLines;
    this.ambiguousDirections = params.ambiguousDirections;
    this.ambiguousStations = params.ambiguousStations;
}

module.exports = {
    init,
    getVersion,
    getLines,
    getDirections,
    getStations,
    getMissionsNext,
    getMissionsFrequency,
    AmbiguityError
};
