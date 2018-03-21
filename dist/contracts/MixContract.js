'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Core library for interactions with Ethereum blockchains

/**
 * Provide interaction interface to MIX contracts
 *
 * @class
 *
 */

// Abstract base class to allow for different connection methods
var MixContract = function MixContract() {
    _classCallCheck(this, MixContract);

    if (new.target === 'MixConnectorBase') {
        throw new TypeError("Cannot construct Abstract instances directly");
    }

    if (this.contractConnect === 'undefined') {
        throw new TypeError("Connect method must be implemented");
    }
};

exports.default = MixContract;