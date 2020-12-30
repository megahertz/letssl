'use strict';

const { describe, expect, it } = require('humile');
const { getCertificate } = require('../../src');
const { useTempDir } = require('../../src/__specs__/helpers');
const { readCertificateInfo } = require('../../src/cerificate');

describe('Self-signed certificate', () => {
  const getTempDir = useTempDir();

  it('should return certificate with provider commonName', async () => {
    const [, certificate] = await getCertificate({
      commonName: 'letssl.localhost',
      storageDirPath: getTempDir(),
      provider: 'selfSigned',
    });

    const info = await readCertificateInfo(certificate);

    expect(info.domains.commonName).toBe('letssl.localhost');
  });
});
