var assert = require('chai').assert;

var wsiv = require('../dist/wsiv');

describe('wsiv', function() {
    it('should be an object', function() {
        assert.isObject(wsiv);
    });

    it('should expose functions', function() {
        ['init', 'getVersion', 'getLines', 'getStations',
         'getMissionsNext', 'getMissionsFrequency'].forEach(function(f) {
             assert.isFunction(wsiv[f], f + ' is not a function');
         });
    });

});