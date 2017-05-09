# paris-wsiv

## wsiv?
`wsiv` stands for Web Service "Information Voyageur", French for "Travel Information". It provides real-time information on the Paris public transit system and traffic.
This web service is provided by the [RATP](https://en.wikipedia.org/wiki/RATP_Group) (Paris public transit operator), as part of their [Open Data](http://www.ratp.fr/en/ratp/r_70350/open-data/) initiative.

wsiv web site (in French): [https://data.ratp.fr/page/temps-reel/](https://data.ratp.fr/page/temps-reel/)

DISCLAIMER: this project is not affiliated to the RATP, and
is provided as-is with no official support.

This package is primarily meant to run on an "edge server", to access the soap-based wsiv through a simple HTTP REST API.

## API

- `/about`: returns this package version and the wsiv version information
- `/stations`: returns a list of stations
- `/lines`: returns a line
- `/directions/line`: returns the direction(s) for a line
- `/missions-next/station`: returns the next missions (trains) at a station

All responses content type is `application/json`.

### About

Returns some version information
```
GET /about
{"version":"2.6.1 / 20170130"}
```

### Get stations

Stations can be retrieved by name, id, line or geopoint.

#### Get stations by name

`/stations?name={name}` where `{name}` is a station name expression

```
GET /stations?name=opera
[...22 stations...]
```
`{name}` can contain the `*` wildcard, either starts with: `opera*`, ends with: `*opera`

```
GET /stations?name=opera*
[...31 stations...]
```

Multiple name expression can be AND'ed with several `q` query parameters
```
GET /stations/name?q=opera*&q=*rue*`
[{"id":"-4008283","name":"Opera Rue de la Paix",...}]
```

### Get station by id

`/stations/{id}` where `{id}` identifies one given station

returns an empty or single-item array

Example:
```
GET /stations/-4008283
[{"id":"-4008283","name":"Opera Rue de la Paix",...}]
```

### Get stations by line

`/stations?line=`

### Get stations by geo endpoint

`/stations?geopoint` not implemented yet

## Development
- install [Node.js](https://nodejs.org) version 4 or greater
- clone this repository
- change to the clone directory and run `npm install`

Some npm commands:
- `npm run build`: builds the runnable dist/wsiv.js
- `npm run test`: runs the unit tests written under test/
- `npm run proxy`: runs a proxy to the wsiv endpoint (details below)

### proxy

As the wsiv service is reachable from registered URL only, you might want to run a proxy on the registered server when developing.
This package comes with a basic proxy to be run on the registered server:
On the proxy server (wsiv registered URL):
- install this package with the `--only=dev` options:
    + `npm install paris-wsiv --only=dev`
- execute `npm run proxy`
    + listen on port 8000 by default
    + or set the `PORT` environment variable: `PORT=9999 npm run proxy`

Example:
IP 1.2.3.4 is a registered wsiv URL. After starting `npm run proxy` on 1.2.3.4 as explained above,
it is possible to develop locally by setting the `ENDPOINT` environment variable
`ENDPOINT=1.2.3.4 npm run dev`