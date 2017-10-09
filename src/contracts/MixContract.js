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