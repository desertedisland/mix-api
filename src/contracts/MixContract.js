// Core library for interactions with Ethereum blockchains

import MixConnector from '../MixConnector.js';

/**
 * Provide interaction interface to MIX contracts
 *
 * @class
 *
 */

// Abstract base class to allow for different connection methods
class MixContractBase extends MixConnector{

    constructor() {

        super();

        if (new.target === 'MixConnectorBase') {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        if (this.contractConnect === 'undefined') {
            throw new TypeError("Connect method must be implemented");
        }

    }
}



export default class MixContract extends MixContractBase{

    /**
     * Connect to a network via:
     *  - web3 object supplied as param
     *  - Explicit URI supplied as param
     *  - Explicit URI stored in localstorage.
     *  - Metamask (https://metamask.io/)
     *
     * Explicit URI overrides Metamask
     *
     * @constructor
     * @param {String}[nodeURI = null] nodeURI
     * @param {Object}[web3 = null] web3
     *
     * @throws{Error} if connection is not made
     *
     */
    constructor(nodeURI = null, web3Object = null) {

        super();

        try{

            this.blockchainConnect(nodeURI, web3Object);

        }catch(err){

            console.error(err);
            return;
        }


    }



}