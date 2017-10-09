// Core library for interactions with Ethereum blockchains

/**
 * Provide interaction interface to MIX contracts
 *
 * @class
 *
 */

// Abstract base class to allow for different connection methods
export default class MixContract{

    constructor() {

        if (new.target === 'MixConnectorBase') {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        if (this.contractConnect === 'undefined') {
            throw new TypeError("Connect method must be implemented");
        }

    }
}

