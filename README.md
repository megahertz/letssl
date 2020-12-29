# letssl
[![Tests](https://github.com/megahertz/letssl/workflows/Tests/badge.svg)](https://github.com/megahertz/letssl-v2/actions?query=workflow%3A%22Tests%22)
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

## Credits

 - [acme-client](https://github.com/publishlab/node-acme-client) ACME client
  used under the hood
  
 - [node-simple-cert](https://github.com/chromakode/node-simple-cert) Similar
 library
