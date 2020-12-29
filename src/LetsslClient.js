'use strict';

const {
  createPrivateKey,
  readCertificateInfo,
  retrieveCertificate,
} = require('./acme');
const Certificate = require('./Certificate');
const HttpServerChallenge = require('./challenge/HttpServerChallenge');
const Logger = require('./Logger');
const Options = require('./Options');
const Storage = require('./Storage');

class LetsslClient {
  constructor(options) {
    /**
     * @type {Options}
     */
    this.options = new Options(options);
    this.options.validate();

    this.logger = new Logger(this.options.logger);

    /**
     * @type {Storage}
     */
    this.storage = options.storage || new Storage({
      storageDirPath: this.options.storageDirPath,
      commonName: this.options.commonName,
    });

    this.certificate = new Certificate(this.storage, this.options);
  }

  useBuiltInHttpServer(port = 80) {
    this.challenge = new HttpServerChallenge(this.storage, this.logger, {
      port,
    });
  }

  /**
   * @returns {Promise<[Buffer, Buffer]>}
   */
  async getCertificate() {
    if (!this.challenge) {
      throw new Error(
        'Challenge method is not set. Call useBuiltInHttpServer first'
      );
    }

    const isActualCertificate = await this.certificate.isActual();

    if (isActualCertificate) {
      this.logger.debug('Existed certificate is used');
      return this.certificate.getKeyCertificatePair();
    }

    try {
      this.logger.info('No existed certificate. Trying to retrieve a new…');

      await this.challenge.prepare();

      const [privateKey, certificate] = await retrieveCertificate({
        accountKey: await this.storage.loadAccountKey(createPrivateKey),
        altNames: this.options.altNames,
        commonName: this.options.commonName,
        debugLevel: this.options.debugLevel,
        directoryUrl: this.options.directoryUrl,
        email: this.options.email,
        httpOptions: this.options.httpOptions,
        onChallengeCreated: this.challenge.onChallengeCreated,
        onChallengeRemoved: this.challenge.onChallengeRemoved,
        privateKey: await this.storage.loadPrivateKey(createPrivateKey),
      });

      await this.storage.saveCertificate(certificate);
      await this.options.onCertificateIssued(privateKey, certificate);
      this.logger.info('New certificate issued');

      if (this.options.renewInTheFuture) {
        await this.renewInTheFuture(certificate);
      }

      return [privateKey, certificate];
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      await this.challenge.finish();
    }
  }

  /**
   * @param {Buffer} certificate
   * @returns {Promise<void>}
   * @private
   */
  async renewInTheFuture(certificate) {
    const renew = async () => {
      this.logger.info('Renewing certificate');
      try {
        const [privateKey, newCertificate] = await this.getCertificate();
        this.options.onCertificateRenewed(privateKey, newCertificate);
      } catch (e) {
        this.logger.error(e);
      }
    };

    const certInfo = await readCertificateInfo(certificate);

    const renewIn = certInfo.notAfter.getTime() - Date.now()
      - this.options.renewThresholdDays * Certificate.DAY_IN_MS;

    if (renewIn < 2 ** 31) {
      setTimeout(renew, renewIn);
    }
  }
}

module.exports = LetsslClient;
