'use strict';

const Challenge = require('./challenge/Challenge');
const LetsslClient = require('./LetsslClient');
const Storage = require('./Storage');

module.exports = {
  Challenge,
  getCertificate,
  LetsslClient,
  Storage,
};

async function getCertificate(userOptions) {
  const client = new LetsslClient(userOptions);
  client.useBuiltInHttpServer(userOptions.builtInServerPort);
  return client.getCertificate();
}
