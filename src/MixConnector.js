
// MixConnector - A library to connect to an Ethereum based block chain.
// Currently the connection is to a node specified by IP - connection methods will be added in the future
// hence the abstract base class.

// Abstract base class to allow for different connection methods
class MixConnectorBase{

    constructor() {

        if (new.target === 'MixConnectorBase') {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        if (this.httpConnect === 'undefined') {
            throw new TypeError("Connect method must be implemented");
        }

    }
}

export default class MixConnector extends MixConnectorBase{

    constructor(){

        super();

    }

    blockchainConnect(nodeURI = null, web3Object = null){

        let uri = nodeURI;
        
        this.web3 = null;

        // Next see if a node URI has been set in localStorage. (localStorage will be undefined in tests)
        if(!uri && typeof localStorage !== 'undefined' ){

            uri = localStorage.getItem('mix-node-uri');

        }

        // If web3Object has been supplied, that takes precedence over everything else.
        if(web3Object){
            this.web3 = web3Object;
        }

        // If nodeURI has been supplied, attempt to connect with that.
        if (uri && !this.web3) {

            this.httpConnect(uri);

        }

        // No other option specified. Use metamask (web3 will be defined in global context)
        if(!this.web3 && (typeof web3 !== 'undefined')){

            this.web3 = web3;

        }

        // Test connection
        if(!this.web3 || !this.web3.isConnected()){
            throw new Error('Not connected to network');
        }


    }

    httpConnect(nodeURI){

        const Web3 = require('web3');
        
        try{

            this.web3 = new Web3(new Web3.providers.HttpProvider(nodeURI));

        }catch(err){

            console.error(err.message);

        }

    }

    /**
     * Determine if the client is connected to an Ethereum provider
     *
     * @returns {Boolean}
     */

    isConnected(){

        return this.web3.isConnected();

    }

}
