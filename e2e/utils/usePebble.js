'use strict';

const { spawn } = require('child_process');
const { beforeEach, afterEach } = require('humile');
const path = require('path');

/**
 * @typedef { import('child_process').Process } Process
 */

module.exports = usePebble;

const PEBBLE_PATH = path.join(__dirname, '../pebble');
const PEBBLE_BIN = path.join(PEBBLE_PATH, 'pebble_linux-amd64');

function usePebble({ logOutput = false } = {}) {
  /** @type {Process} */
  let pebbleProcess;

  // eslint-disable-next-line arrow-body-style
  beforeEach(async () => {
    return new Promise((resolve) => {
      pebbleProcess = spawn(PEBBLE_BIN, {
        cwd: PEBBLE_PATH,
      });

      pebbleProcess.stdout.on('data', (chunk) => {
        if (chunk.includes('ACME directory available at')) {
          resolve();
        }
      });

      if (logOutput) {
        pebbleProcess.stdout.pipe(process.stdout);
        pebbleProcess.stderr.pipe(process.stderr);
      }
    });
  });

  afterEach(() => {
    if (pebbleProcess) {
      pebbleProcess.kill();
    }
  });
}
