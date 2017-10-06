// Core library for interactions with Ethereum blockchains

import MixConnector from './MixConnector.js';
import MixSystemStats from './MixSystemStats.js';
import MixSearch from './MixSearch.js';

/**
 * Provide high level functionality for MIX blockchain interfaces.
 *
 * - Connection to a blockchain
 * - Blockchain stats
 * - Search
 *
 * @class
 *
 */
export default class MixClient extends MixConnector{

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

        // Instantiate libraries
        this._systemStats = new MixSystemStats(this.web3);
        this._mixSearch = new MixSearch(this.web3);

    }

    /**
     * Determine which blockchain the client is connected to by matching the hash
     * of block 192001 from the connected blockchain to known blockchains
     *
     * @returns {Promise}
     */

    getBlockchainName(){

        const IDENTIFYING_BLOCK = 1920001,
            blockchainHashes = {
            '0x4fa57903dad05875ddf78030c16b5da886f7d81714cf66946a4c02566dbb2af5' : 'Mix',
            '0x87b2bc3f12e3ded808c6d4b9b528381fa2a7e95ff2368ba93191a9495daa7f50' : 'Ethereum',
            '0xab7668dfd3bedcf9da505d69306e8fd12ad78116429cf8880a9942c6f0605b60' : 'Ethereum Classic'
        };

        return new Promise(
            (resolve, reject)=>{

                // The Ethereum hard fork was at block 1920000. Therefore the block at 1920001 will have a different hash
                // depending on whether it is from the Ethereum or Ethereum classic blockchain.
                this.getBlock(IDENTIFYING_BLOCK).then(
                    (block)=>{

                        if(typeof blockchainHashes[block.hash] === 'undefined'){

                            return resolve('Unknown blockchain');

                        }

                        resolve(blockchainHashes[block.hash]);

                    }
                );

            }
        );

    }

    /**
     * Watch the network for new blocks
     *
     * @param {function} callback
     * @param {function} errorCallback
     * @returns {Object} filter
     */
    watchNetwork(callback, errorCallback){

        const filter = this.web3.eth.filter('latest');

        filter.watch(function(error, result){

            if(error){
                return errorCallback(error);
            }

            callback(result);

        });

        return filter;

    }

    /**
     *  Take a hash, address or block number and search for:
     * - An account balance
     * - A transaction
     * - A block
     *
     * @param query
     * @returns {Promise}
     *
     */
    doSearch(query){

        const promises = [
            this._mixSearch.getBlock(query),
            this._mixSearch.getBalance(query),
            this._mixSearch.getTransaction(query)
        ];

        return new Promise(
            (resolve, reject)=>{

                Promise.all(promises).then(
                    (results)=>{

                        resolve(
                            {
                                block : results[0],
                                account : results[1],
                                transaction : results[2]
                            }
                        )

                    }
                ).catch(
                    (error)=>{

                        reject(error);

                    }
                )


            }
        )

    }

    /**
     * Numerous asynchronous calls to various APIs to retrieve system stats based on the last ten blocks
     * of the blockchain. getLatestBlocks will initially make an asynchronous call to retrieve each
     * individual block (I'm not aware of any other way of doing that with the web3 api). You can avoid that
     * if you supply an existing list of latestBlocks via the param.
     *
     * @param {Array} [latestBlocks = null] - a prepopulated list of blocks
     * @returns {Promise}
     *
     */
    getSystemStats(latestBlocks = null) {

        // Must get system state before everything else.
        return new Promise(
            (resolve, reject)=>{

                let stats = {};

                this._systemStats.getState().then(
                    (state)=>{

                        stats.state = state;

                        let promises = [
                            this._systemStats.getPeerCount(),
                            this._systemStats.getGasPrice()
                        ];

                        if(!latestBlocks){
                            promises.push(this._systemStats.getLatestBlocks());
                        }

                        Promise.all(promises).then(
                            (results)=>{

                                stats.peerCount = results[0];
                                stats.gasPrice = results[1];

                                stats.latestBlocks = latestBlocks || results[2];

                                stats.difficulty = this._systemStats.getAverageDifficulty(stats.latestBlocks);
                                stats.blockTimes = this._systemStats.getBlockTimes(stats.latestBlocks);
                                stats.hashRate = this._systemStats.getHashRate();

                                resolve(stats);

                            }
                        ).catch(
                            (error)=>{

                                console.error(error.message);
                                reject(error);

                            }
                        );

                    }
                );

            }
        )
    }

    /**
     * Add a new block to the latestBlocks list and update the system stats
     *
     * @param {Array} latestBlocks - a list of Ethereum blocks
     * @returns {Promise}
     */
    updateBlocks(latestBlocks){

        this._systemStats.setLatestBlocks(latestBlocks);

        // Returns promise
        return this.getSystemStats(latestBlocks);

    }

    /**
     * Returns the last ten blocks of the blockchain
     *
     * @returns {Promise}
     */

    getBlocks(){

        return new Promise(
            (resolve, reject)=>{

                this._systemStats.getState().then(
                    ()=>{

                        this._systemStats.getLatestBlocks().then(
                            (latestBlocks)=>{

                                resolve(latestBlocks);

                            }
                        )

                    }
                )

            }
        );

    }

    /**
     * Return an Ethereum block based on block hash or number
     *
     * @param {String} hashOrNumber
     * @returns {Promise}
     */
    getBlock(hashOrNumber){

        // Returns promise
        return this._mixSearch.getBlock(hashOrNumber);

    }

    /**
     * Retrieve a transaction by transaction hash
     *
     * @param {String} transactionHash
     * @returns {Promise}
     */
    getTransaction(transactionHash){

        // Returns promise
        return this._mixSearch.getTransaction(transactionHash);

    }

    /**
     * Retrieve the balance for an account at accountHash
     *
     * @param {String} accountHash
     * @returns {Promise}
     */
    getAccountBalance(accountHash){

        // Returns promise
        return this._mixSearch.getBalance(accountHash);

    }

}