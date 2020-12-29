'use strict';

class Logger {
  constructor(logMethods = {}) {
    this.methods = logMethods || {};

    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.debug = this.debug.bind(this);
  }

  error(...args) {
    if (typeof this.methods.error !== 'function') {
      return;
    }

    this.methods.error('letssl:', ...args);
  }

  warn(...args) {
    if (typeof this.methods.warn !== 'function') {
      return;
    }

    this.methods.warn('letssl:', ...args);
  }

  info(...args) {
    if (typeof this.methods.info !== 'function') {
      return;
    }

    this.methods.info('letssl:', ...args);
  }

  debug(...args) {
    if (typeof this.methods.debug !== 'function') {
      return;
    }

    this.methods.debug('letssl:', ...args);
  }
}

module.exports = Logger;
