'use strict';

/* eslint-disable no-unused-vars */

class Provider {
  /**
   * @param {Options} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {object} providerOptions
   * @returns {Promise<[Buffer, Buffer]>}
   * @abstract
   */
  getCertificate(providerOptions) {
    throw new Error('Not implemented');
  }
}

module.exports = Provider;
