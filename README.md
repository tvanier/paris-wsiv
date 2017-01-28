# paris-wsiv

## wsiv?
`wsiv` stands for Web Service "Information Voyageur", French for "Travel Information". It provides real-time information on the Paris public transit system and traffic.
This web service is provided by the [RATP](https://en.wikipedia.org/wiki/RATP_Group) (Paris public transit operator), as part of their [Open Data](http://www.ratp.fr/en/ratp/r_70350/open-data/) initiative.

wsiv web site (in French): https://data.ratp.fr/page/temps-reel/

DISCLAIMER: this project is not affiliated to the RATP, and
is provided as-is with no official support.

This package is meant to run on an "edge server", to access the soap-based wsiv through a simple HTTP REST API.

## API

- `/about`
    - returns this package version and the wsiv version information
- `/stations`
    - returns a list of stations
    - `/stations?name={name}`
    - `/stations?id={id}`
- `/lines/{line-id}`
    - returns a line
- `/directions/line/{line-id}`
    - returns the direction for a line
- `/missions-next/station/{station-id}?direction={direction}`
    - return the next missions at a station

All responses content type is `application/json`.

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
it is possible to develop locally by setting the PROXY environment variable
`PROXY=1.2.3.4 npm run dev`