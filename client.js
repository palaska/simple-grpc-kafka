'use strict';

const PROTO_PATH = __dirname + '/default.proto';
const generateCoords = require('./random_coords');
const grpc = require('grpc');
const default_proto = grpc.load(PROTO_PATH);

const client = new default_proto.CoordinateHandler('localhost:50051', grpc.credentials.createInsecure());

// send random coordinates to server each second
setInterval(() => {
  const coords = generateCoords({ latMin: 40.5, latMax: 41.5, lngMin: 28.5, lngMax: 29.5 });
  client.processCoordinate(coords, () => {});
}, 1000);
