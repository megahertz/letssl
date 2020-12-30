'use strict';

/* eslint-disable global-require */

const { axios, Client, directory, forge } = require('acme-client');
const Provider = require('./Provider');

const PRODUCTION_URL = directory.letsencrypt.production;
const STAGING_URL = directory.letsencrypt.staging;

class AcmeProvider extends Provider {
  async getCertificate({
    accountKey,
    challenge,
    privateKey,
  }) {
    const { commonName, debugLevel, altNames } = this.options;

    let directoryUrl = this.options.directoryUrl;
    if (!directoryUrl) {
      directoryUrl = debugLevel ? STAGING_URL : PRODUCTION_URL;
    }

    if (this.options.httpOptions) {
      Object.assign(axios.defaults, this.options.httpOptions);
    }

    if (debugLevel) {
      if (debugLevel > 2) {
        enableDebug('acme-client,follow-redirects');
      } else if (debugLevel === 2) {
        enableDebug('acme-client');
      }
    }

    const client = new Client({ directoryUrl, accountKey });

    const [, csr] = await forge.createCsr({ commonName, altNames }, privateKey);

    const certificate = await client.auto({
      csr,
      email: this.options.email,
      termsOfServiceAgreed: true,
      challengeCreateFn: challenge.onChallengeCreated,
      challengeRemoveFn: challenge.onChallengeRemoved,
      challengePriority: ['http-01'],
    });

    return [privateKey, certificate];
  }
}

function enableDebug(namespaces) {
  try {
    // noinspection NpmUsedModulesInstalled
    const debug = require('debug');
    debug.enable(namespaces);
  } catch (e) {
    // ignore
  }
}

module.exports = AcmeProvider;
