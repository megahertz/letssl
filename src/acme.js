/* eslint-disable global-require */

'use strict';

const { axios, Client, directory, forge } = require('acme-client');

const PRODUCTION_URL = directory.letsencrypt.production;
const STAGING_URL = directory.letsencrypt.staging;

module.exports = {
  createPrivateKey,
  readCertificateInfo,
  retrieveCertificate,
};

async function createPrivateKey() {
  return forge.createPrivateKey();
}

async function readCertificateInfo(buffer) {
  return forge.readCertificateInfo(buffer);
}

/**
 * @returns {Promise<[Buffer, Buffer]>}
 */
async function retrieveCertificate({
  accountKey,
  altNames = [],
  commonName,
  debugLevel = 0,
  directoryUrl,
  email,
  httpOptions = {},
  onChallengeCreated,
  onChallengeRemoved,
  privateKey,
}) {
  let actualDirectoryUrl = directoryUrl;
  if (!actualDirectoryUrl) {
    actualDirectoryUrl = debugLevel ? STAGING_URL : PRODUCTION_URL;
  }

  if (httpOptions) {
    Object.assign(axios.defaults, httpOptions);
  }

  if (debugLevel) {
    if (debugLevel > 2) {
      enableDebug('acme-client,follow-redirects');
    } else if (debugLevel === 2) {
      enableDebug('acme-client');
    }
  }

  const client = new Client({
    directoryUrl: actualDirectoryUrl,
    accountKey,
  });

  const [, csr] = await forge.createCsr({ commonName, altNames }, privateKey);

  const certificate = await client.auto({
    csr,
    email,
    termsOfServiceAgreed: true,
    challengeCreateFn: onChallengeCreated,
    challengeRemoveFn: onChallengeRemoved,
    challengePriority: ['http-01'],
  });

  return [privateKey, certificate];
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
