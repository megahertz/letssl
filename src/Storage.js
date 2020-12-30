'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

class Storage {
  constructor({
    commonName = null,
    fileNames = null,
    keyFileMode = 0o600,
    platform = process.platform,
    storageDirPath = null,
  }) {
    this.keyFileMode = keyFileMode;

    this.fileNames = fileNames || {
      accountKey: 'account.pem',
      privateKey: 'private-key.pem',
      certificate: 'certificate.pem',
      challengeDir: 'www/.well-known/acme-challenge',
    };

    this.storageDirPath = storageDirPath || this.getDefaultPath(
      commonName,
      platform
    );
  }

  /**
   * @param {() => Promise<Buffer>} defaultGetter
   * @return {Promise<Buffer | null>}
   */
  async loadAccountKey(defaultGetter = null) {
    return this.load('accountKey', defaultGetter);
  }

  /**
   * @param {() => Promise<Buffer>} defaultGetter
   * @return {Promise<Buffer | null>}
   */
  async loadPrivateKey(defaultGetter = null) {
    return this.load('privateKey', defaultGetter);
  }

  /**
   * @param {Buffer} buffer
   * @returns {Promise<void>}
   */
  async savePrivateKey(buffer) {
    await this.save('privateKey', buffer);
  }

  /**
   * @return {Promise<Buffer | null>}
   */
  async loadCertificate() {
    return this.load('certificate');
  }

  /**
   * @param {Buffer} buffer
   * @returns {Promise<void>}
   */
  async saveCertificate(buffer) {
    await this.save('certificate', buffer);
  }

  /**
   * @param {string} token
   * @returns {Promise<Buffer>}
   */
  async loadChallenge(token) {
    const filePath = this.getFilePath('challengeDir', token);

    try {
      return await fs.promises.readFile(filePath);
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {string} token
   * @param {Buffer} keyAuthorization
   * @returns {Promise<void>}
   */
  async saveChallenge(token, keyAuthorization) {
    const filePath = this.getFilePath('challengeDir', token);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, keyAuthorization);
  }

  /**
   * @param {string} token
   * @returns {Promise<void>}
   */
  async removeChallenge(token) {
    const filePath = this.getFilePath('challengeDir', token);
    await fs.promises.unlink(filePath);
  }

  /**
   * @param {keyof Storage['fileNames']} fileKey
   * @param {() => Promise<Buffer>} defaultGetter
   * @returns {Promise<Buffer | null>}
   * @protected
   */
  async load(fileKey, defaultGetter = null) {
    const filePath = this.getFilePath(fileKey);

    try {
      return await fs.promises.readFile(filePath);
    } catch (e) {
      // It's ok when the file isn't available
    }

    if (typeof defaultGetter !== 'function') {
      return null;
    }

    const defaultData = await defaultGetter();
    if (defaultData) {
      await this.save(fileKey, defaultData);
      return defaultData;
    }

    return null;
  }

  /**
   * @param {keyof Storage['fileNames']} fileKey
   * @param {string} postfix
   * @returns {string}
   */
  getFilePath(fileKey, postfix = '') {
    if (!this.fileNames[fileKey]) {
      throw new Error(`Unknown storage key ${fileKey}`);
    }

    return path.join(
      this.storageDirPath,
      this.fileNames[fileKey],
      postfix || ''
    );
  }

  /**
   * @param {keyof Storage['fileNames']} fileKey
   * @param {Buffer} buffer
   * @returns {Promise<void>}
   */
  async save(fileKey, buffer) {
    const filePath = this.getFilePath(fileKey);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, buffer, { mode: this.keyFileMode });
  }

  /**
   * @param {string} commonName
   * @param {string} platform
   * @returns {string}
   * @protected
   */
  getDefaultPath(commonName, platform) {
    const appDataPath = getAppDataPath(platform);
    return path.join(appDataPath, 'letssl', commonName);
  }
}

function getAppDataPath(platform) {
  const home = os.homedir();

  switch (platform) {
    case 'darwin': {
      return path.join(home, 'Library/Application Support');
    }

    case 'win32': {
      return process.env.APPDATA || path.join(home, 'AppData/Roaming');
    }

    default: {
      return process.env.XDG_CONFIG_HOME || path.join(home, '.config');
    }
  }
}

module.exports = Storage;
