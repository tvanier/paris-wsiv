var express = require('express');
var wsivExpress = require('./dist/wsiv-express');

var app = express();

app.use('/wsiv', wsivExpress({
    wsdlPath: __dirname + '/./Wsiv.wsdl',
    endpoint: process.env.ENDPOINT
}));

var port = process.env.PORT || 8000;
app.listen(port);
console.log('listening on port ' + port);