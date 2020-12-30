'use strict';

const { forge } = require('acme-client');

module.exports = {
  createPrivateKey,
  readCertificateInfo,
};

async function createPrivateKey() {
  return forge.createPrivateKey();
}

async function readCertificateInfo(buffer) {
  return forge.readCertificateInfo(buffer);
}
