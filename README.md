# letssl
[![Tests](https://github.com/megahertz/letssl/workflows/Tests/badge.svg)](https://github.com/megahertz/letssl/actions?query=workflow%3ATests)
[![npm version](https://img.shields.io/npm/v/letssl?color=brightgreen)](https://www.npmjs.com/package/letssl)

## Description

Simple way to retrieve SSL certificate using HTTP ACME challenge. By default,
[Let's Encrypt Authority](https://letsencrypt.org/) is used.

## Installation

Install with [npm](https://npmjs.org/package/letssl):

    npm install --save letssl

## Usage

```js
const express = require('express');
const https = require('https');
const { getCertificate } = require('letssl');

async function startServer() {
  const [key, cert] = await getCertificate({ commonName: 'example.com' });
  
  const app = express();
  app.get('/', (req, res) => {
    res.end('Using SSL');
  });
  
  const server = https.createServer({ key, cert }, app).listen(443);
}

startServer();

```

## Testing

There are three ways how certificate obtaining process could be tested.

### Self-signed certificate

When you don't need to test real domain you can set the `provider` option to
`selfSigned`:

```js
const [key, cert] = await getCertificate({
  commonName: 'example.localhost',
  provider: 'selfSigned',
});
```

### Let's Encrypt staging

When `debugLevel` is set and no `directoryUrl` provider,
https://acme-staging-v02.api.letsencrypt.org/directory is used as `directoryUrl`

const [key, cert] = await getCertificate({
  commonName: 'stage.example.com',
  debugLevel: 1, // when > 0 and no directoryUrl, 
});

### Test ACME server

If you need to run tests frequently, you can use 
[Pebble](https://github.com/letsencrypt/pebble), a small ACME test server.
See [the e2e test](e2e/specs/built-in-http.spec.js) for example.

## Credits

 - [acme-client](https://github.com/publishlab/node-acme-client) ACME client
  used under the hood
  
 - [node-simple-cert](https://github.com/chromakode/node-simple-cert) Similar
 library
