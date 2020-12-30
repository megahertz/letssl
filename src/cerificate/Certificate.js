'use strict';

const { readCertificateInfo } = require('./utils');

class Certificate {
  /**
   * @param {Storage} storage
   * @param {Options} options
   */
  constructor(storage, options) {
    this.storage = storage;
    this.options = options;
  }

  /**
   * @returns {Promise<[Buffer, Buffer] | null>}
   */
  async getKeyCertificatePair() {
    const key = await this.storage.loadPrivateKey();
    const certificate = await this.storage.loadCertificate();

    if (key && certificate) {
      return [key, certificate];
    }

    return null;
  }

  /**
   * @returns {Promise<Date>}
   */
  async getRenewingDate() {
    const certificate = await this.storage.loadCertificate();
    if (!certificate) {
      return new Date(Date.now() - 1);
    }

    const certificateInfo = await readCertificateInfo(certificate);
    const expiresAt = certificateInfo.notAfter.getTime();

    return new Date(
      expiresAt - this.options.renewThresholdDays * Certificate.DAY_IN_MS
    );
  }

  /**
   * @returns {Promise<boolean>}
   */
  async isActual() {
    const renewingDate = await this.getRenewingDate();
    return Date.now() < renewingDate.getTime();
  }
}

Certificate.DAY_IN_MS = 24 * 60 * 60 * 1000;

module.exports = Certificate;
