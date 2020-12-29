'use strict';

class Challenge {
  /**
   * @param {Storage} storage
   * @param {Logger} logger
   * @param {object} challengeOptions
   */
  constructor(storage, logger, challengeOptions) {
    this.storage = storage;
    this.logger = logger;
    this.challengeOptions = challengeOptions;

    this.onChallengeCreated = this.onChallengeCreated.bind(this);
    this.onChallengeRemoved = this.onChallengeRemoved.bind(this);
  }

  async prepare() {
    // Could be implemented by a descendant
  }

  async finish() {
    // Could be implemented by a descendant
  }

  async onChallengeCreated(_, challenge, keyAuthorization) {
    if (challenge.type !== 'http-01') {
      throw new Error(`Unsupported ACME challenge type ${challenge.type}`);
    }

    await this.storage.saveChallenge(challenge.token, keyAuthorization);
  }

  async onChallengeRemoved(_, challenge) {
    if (challenge.type !== 'http-01') {
      throw new Error(`Unsupported ACME challenge type ${challenge.type}`);
    }

    await this.storage.removeChallenge(challenge.token);
  }
}

module.exports = Challenge;
