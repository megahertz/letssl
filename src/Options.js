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
    this.renewThresholdDays = renewThresholdDays;
    this.renewInTheFuture = renewInTheFuture;
    this.storageDirPath = storageDirPath;
  }

  validate() {
    if (!validateUrl(this.directoryUrl)) {
      throw new Error(`Invalid directoryUrl option "${this.directoryUrl}"`);
    }

    if (!this.commonName) {
      throw new Error('Invalid commonName option');
    }
  }
}

function validateUrl(url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = Options;
