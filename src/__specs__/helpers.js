'use strict';

const { beforeEach, afterEach } = require('humile');
const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = {
  useTempDir,
};

function useTempDir(prefix = 'letssl-test') {
  let dirPath;

  beforeEach(async () => {
    dirPath = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), `${prefix}-`)
    );
  });

  afterEach(async () => {
    await fs.promises.rmdir(dirPath, { recursive: true });
  });

  return () => dirPath;
}
