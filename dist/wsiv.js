
'use strict';

var soap = require('strong-soap').soap;

var defaults = {
    wsdlPath: '',
    endpoint: '',
    logger: {
        log: console.log.bind(console, 'wsiv')
    }
};

var soapClient = void 0;
var logger = defaults.logger;

var init = function init(params) {
    params = Object.assign({}, defaults, params);

    if (soapClient) {
        return Promise.resolve(soapClient);
    }

    logger = params.logger;

    return new Promise(function (resolve, reject) {
        soap.createClient(params.wsdlPath, {}, function (error, client) {
            if (error) {
                logger.log('init error', { error: error });
                reject(error);
                return;
            }

            logger.log('init success');
            logger.log(client.describe());
            if (params.endpoint) {
                logger.log('setEndpoint', params.endpoint);
                client.setEndpoint(params.endpoint);
            }
            soapClient = client;
            resolve(client);
        });
    });
};

var callApiMethod = function callApiMethod(method, methodArgs) {
    logger.log(method, methodArgs);

    return init().then(function (client) {
        return new Promise(function (resolve, reject) {
            client.Wsiv.WsivSOAP11port_http[method](methodArgs, function (error, result) {
                if (error) {
                    logger.log(method + ' error', { error: error });
                    reject(error);
                    return;
                }

                resolve(result);
            });
        }).catch(function (error) {
            logger.log(method + ' error', { error: error });
            throw error;
        });
    });
};

var getVersion = function getVersion() {
    return callApiMethod('getVersion').then(function (result) {
        var version = result ? result.return : 'unknown';
        logger.log('getVersion success', { version: version });
        return version;
    });
};

var getLines = function getLines() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    return callApiMethod('getLines', filter).then(function (result) {
        var lines = result ? result.return : [];
        logger.log('getLines success', { filter: filter, linesCount: lines.length });
        return lines;
    });
};

var getDirections = function getDirections(line) {
    return callApiMethod('getDirections', { line: line }).then(function (result) {
        var directions = result ? result.return : {};
        logger.log('getLines success', { line: line, directions: directions });
        return directions;
    });
};

var getStations = function getStations() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    return callApiMethod('getStations', filter).then(function (result) {
        var stations = result ? result.return.stations : [];
        logger.log('getStations success', { filter: filter, stationsCount: stations.length });
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

var getMissionsNext = function getMissionsNext(station, direction) {
    var methodArgs = {
        station: {
            id: station.id,
            name: station.name
        },
        direction: direction
    };

    return callApiMethod('getMissionsNext', methodArgs).then(function (result) {
        if (result.return && result.return.ambiguityMessage) {
            throw new AmbiguityError(result.ambiguityMessage, result);
        }

        var missions = result ? result.return.missions : [];
        logger.log('getMissionsNext response', { missionsCount: missions.length });
        return missions;
    });
};

var getMissionsFrequency = function getMissionsFrequency(station) {
    var methodArgs = {
        station: {
            id: station.id,
            name: station.name
        }
    };

    return callApiMethod('getMissionsFrequency', methodArgs).then(function (result) {
        if (result && result.ambiguityMessage) {
            throw new AmbiguityError(result.ambiguityMessage, result);
        }

        var missions = result ? result.return : [];
        logger.log('getMissionsFrequency response', { missionsCount: missions.length });
        return missions;
    });
};

function AmbiguityError(message) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.message = message;
    this.ambiguousLines = params.ambiguousLines;
    this.ambiguousDirections = params.ambiguousDirections;
    this.ambiguousStations = params.ambiguousStations;
}

module.exports = {
    init: init,
    getVersion: getVersion,
    getLines: getLines,
    getDirections: getDirections,
    getStations: getStations,
    getMissionsNext: getMissionsNext,
    getMissionsFrequency: getMissionsFrequency,
    AmbiguityError: AmbiguityError
};