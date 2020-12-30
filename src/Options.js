'use strict';

class Options {
  constructor({
    altNames = [],
    commonName,
    debugLevel = 0,
    directoryUrl = null,
    email = null,
    httpOptions = null,
    logger = null,
    onCertificateIssued = () => null,
    onCertificateRenewed = () => null,
    provider = 'acme',
    renewThresholdDays = 30,
    renewInTheFuture = true,
    storageDirPath = null,
  }) {
    this.altNames = altNames;
    this.commonName = commonName;
    this.debugLevel = debugLevel;
    this.directoryUrl = directoryUrl;
    this.email = email;
    this.httpOptions = httpOptions;
    this.logger = (debugLevel && logger === null) ? console : logger;
    this.onCertificateIssued = onCertificateIssued;
    this.onCertificateRenewed = onCertificateRenewed;
    this.provider = provider;
    this.renewThresholdDays = renewThresholdDays;
    this.renewInTheFuture = renewInTheFuture;
    this.storageDirPath = storageDirPath;
  }

  validate() {
    if (!this.commonName) {
      throw new Error('Invalid commonName option');
    }
  }
}

module.exports = Options;
