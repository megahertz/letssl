'use strict';

/* eslint-disable global-require */

const { pki } = require('node-forge');
const Provider = require('./Provider');

const YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

class SelfSignedProvider extends Provider {
  async getCertificate() {
    const { commonName } = this.options;

    const keyPair = pki.rsa.generateKeyPair(2048);
    const certificate = pki.createCertificate();

    certificate.publicKey = keyPair.publicKey;
    certificate.serialNumber = '01';
    certificate.validity.notBefore = new Date();
    certificate.validity.notAfter = new Date(Date.now() + YEAR_IN_MS);

    const attrs = [
      { name: 'commonName', value: commonName },
      { name: 'organizationName', value: 'Letssl' },
    ];
    certificate.setSubject(attrs);
    certificate.setIssuer(attrs);
    certificate.sign(keyPair.privateKey);

    const privateKeyPem = pki.privateKeyToPem(keyPair.privateKey);
    const certificatePem = pki.certificateToPem(certificate);

    return [
      Buffer.from(privateKeyPem),
      Buffer.from(certificatePem),
    ];
  }
}

module.exports = SelfSignedProvider;
