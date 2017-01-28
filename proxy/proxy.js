var http = require('http'),
    httpProxy = require('http-proxy');

// see bottom of ../Wsiv.wsdl
var wsivEndpoint = 'http://opendata-tr.ratp.fr/wsiv/services/Wsiv';

var port = process.env.PORT || 8000;

httpProxy.createProxyServer({target: wsivEndpoint}).listen(8000);

