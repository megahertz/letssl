'use strict';

const https = require('https');
const { describe, expect, it } = require('humile');
const { getCertificate } = require('../../src');
const { useTempDir } = require('../../src/__specs__/helpers');
const { readCertificateInfo } = require('../../src/acme');
const usePebble = require('../utils/usePebble');

const PEBBLE_CHALLENGE_PORT = 5002;
const PEBBLE_ACME_DIR = 'https://localhost:14000/dir';

describe('Built-in HTTP server', () => {
  usePebble();
  const getTempDir = useTempDir();

  it('should pass ACME challenge', async () => {
    const [, certificate] = await getCertificate({
      httpOptions: {
        acmeSettings: { httpChallengePort: PEBBLE_CHALLENGE_PORT },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      },
      commonName: 'letssl.localhost',
      directoryUrl: PEBBLE_ACME_DIR,
      storageDirPath: getTempDir(),
      builtInServerPort: PEBBLE_CHALLENGE_PORT,
    });

    const info = await readCertificateInfo(certificate);

    expect(info.domains.commonName).toBe('letssl.localhost');
  });
});
