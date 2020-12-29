'use strict';

const http = require('http');
const Challenge = require('./Challenge');

const WELL_KNOWN_PATH = '/.well-known/acme-challenge/';

class HttpServerChallenge extends Challenge {
  async prepare() {
    const { port } = this.challengeOptions;

    this.logger.info(
      `Starting a built-in challenge HTTP server on port ${port}`
    );

    return new Promise((resolve, reject) => {
      this.httpServer = http.createServer((req, res) => {
        this.logger.debug(`HTTP request received: ${req.method} ${req.url}`);

        if (req.method !== 'GET' || !req.url.startsWith(WELL_KNOWN_PATH)) {
          send404();
          return;
        }

        const token = req.url.split(WELL_KNOWN_PATH)[1];

        this.storage.loadChallenge(token)
          .then((keyAuthorization) => {
            if (!keyAuthorization) {
              send404();
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/octet-stream');
            res.end(keyAuthorization);
          })
          .catch((e) => {
            this.logger.warn(e);
            send404();
          });

        function send404() {
          res.statusCode = 404;
          res.end();
        }
      });

      this.httpServer.on('error', reject);

      this.httpServer.listen(port, resolve);
    });
  }

  async finish() {
    if (this.httpServer) {
      this.httpServer.close();
      this.logger.info('Stop a built-in challenge HTTP server');
    }
  }
}

module.exports = HttpServerChallenge;
