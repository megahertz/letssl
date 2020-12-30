'use strict';

const AcmeProvider = require('./AcmeProvider');
const SelfSignedProvider = require('./SelfSignedProvider');
const { createPrivateKey, readCertificateInfo } = require('./utils');

module.exports = {
  createProvider,
  createPrivateKey,
  readCertificateInfo,
};

/**
 * @param {Options} options
 * @returns {Provider}
 */
function createProvider(options) {
  if (options.provider === 'selfSigned') {
    return new SelfSignedProvider(options);
  }

  return new AcmeProvider(options);
}
