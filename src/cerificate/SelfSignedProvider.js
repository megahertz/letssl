'use strict';

/* eslint-disable global-require */

const Provider = require('./Provider');

class SelfSignedProvider extends Provider {
  async getCertificate() {
    throw new Error('TBD later');
  }
}

module.exports = SelfSignedProvider;
