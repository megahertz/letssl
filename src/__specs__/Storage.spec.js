'use strict';

const { describe, expect, it } = require('humile');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Storage = require('../Storage');
const { useTempDir } = require('./helpers');

describe('Storage', () => {
  const getTempDir = useTempDir();

  describe('getDefaultPath', () => {
    if (process.platform === 'win32') {
      return;
    }

    const home = os.homedir();

    it('should return specified path if provided', () => {
      const storage = new Storage({
        storageDirPath: '/tmp',
        commonName: 'te.st',
      });

      expect(storage.getFilePath('accountKey')).toBe('/tmp/account.pem');
    });

    it('should set default path on linux', () => {
      const storage = new Storage({
        commonName: 'te.st',
        platform: 'linux',
      });

      expect(storage.getFilePath('accountKey')).toBe(
        path.join(home, '.config/letssl/te.st/account.pem')
      );
    });

    it('should set default path on macOS', () => {
      const storage = new Storage({
        commonName: 'te.st',
        platform: 'darwin',
      });

      expect(storage.getFilePath('accountKey')).toBe(
        path.join(home, 'Library/Application Support/letssl/te.st/account.pem')
      );
    });

    it('should set default path on Windows', () => {
      const storage = new Storage({
        commonName: 'te.st',
        platform: 'win32',
      });

      expect(storage.getFilePath('accountKey')).toBe(
        path.join(home, 'AppData/Roaming/letssl/te.st/account.pem')
      );
    });
  });

  describe('load methods', () => {
    it('should load accountKey', async () => {
      const storage = new Storage({ storageDirPath: getTempDir() });

      await fs.promises.writeFile(
        path.join(getTempDir(), 'account.pem'),
        'test'
      );
      const loadedData = await storage.loadAccountKey();

      expect(loadedData.toString('utf8')).toBe('test');
    });

    it('should load default data', async () => {
      const storage = new Storage({ storageDirPath: getTempDir() });

      const defaultData = await storage.loadAccountKey(() => 'default');
      expect(defaultData.toString('utf8')).toBe('default');

      const savedData = await fs.promises.readFile(
        path.join(getTempDir(), 'account.pem'),
        'utf8'
      );

      expect(savedData).toBe('default');
    });
  });

  it('should save data', async () => {
    const storage = new Storage({ storageDirPath: getTempDir() });

    await storage.saveCertificate('save test');
    const savedData = await fs.promises.readFile(
      path.join(getTempDir(), 'certificate.pem'),
      'utf8'
    );

    expect(savedData).toBe('save test');
  });

  describe('challenge', () => {
    const challengeDir = 'www/.well-known/acme-challenge';

    it('should be loaded', async () => {
      const storage = new Storage({ storageDirPath: getTempDir() });

      await fs.promises.mkdir(
        path.join(getTempDir(), challengeDir),
        { recursive: true }
      );
      await fs.promises.writeFile(
        path.join(getTempDir(), challengeDir, 'challenge'),
        'test'
      );
      const loadedData = await storage.loadChallenge('challenge');

      expect(loadedData.toString('utf8')).toBe('test');
    });

    it('should be saved', async () => {
      const storage = new Storage({ storageDirPath: getTempDir() });

      await storage.saveChallenge('test', Buffer.from('key'));

      const savedData = await fs.promises.readFile(
        path.join(getTempDir(), challengeDir, 'test'),
        'utf8'
      );

      expect(savedData).toBe('key');
    });

    it('should be removed', async () => {
      const storage = new Storage({ storageDirPath: getTempDir() });

      await storage.saveChallenge('test', Buffer.from('key'));
      expect(isExists()).toBe(true);

      await storage.removeChallenge('test');
      expect(isExists()).toBe(false);

      function isExists() {
        return fs.existsSync(
          path.join(getTempDir(), challengeDir, 'test')
        );
      }
    });
  });
});
