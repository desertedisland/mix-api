// Core library for interactions with Ethereum blockchains

import MixHTTPConnector from './MixConnector.js';
import MixSystemStats from './MixSystemStats.js';
import MixSearch from './MixSearch.js';


export default class MixClient {

    /**
     * Connect to a network via Metamask (https://metamask.io/) or explicit URI stored in localstorage.
     * Explicit URI overrides Metamask
     *
     * @constructor
     * @param nodeURI
     *
     */
    constructor(nodeURI = null) {

        this._web3 = null;

        // Node URI may have been stored in local storage by the settings page.
        const nodeUri = nodeURI || localStorage.getItem('mix-node-uri');

        if (nodeUri) {

            this._web3 = MixHTTPConnector.connect(nodeUri);

        // No direct connection specified. Try metamask.
        }else if( typeof web3 !== 'undefined'){

            this._web3 = web3;

        }

        if(!this._web3 || !this._web3.isConnected()){
            throw new Error('Not connected to network');
        }

        this._systemStats = new MixSystemStats(this._web3);
        this._mixSearch = new MixSearch(this._web3);

    }

    /**
     * Watch the network for new blocks
     *
     * @param {function} callback
     * @param {function} errorCallback
     * @returns {Object} filter
     */
    watchNetwork(callback, errorCallback){

        const filter = this._web3.eth.filter('latest');

        filter.watch(function(error, result){

            if(error){
                return errorCallback(error);
            }

            callback(result);

        });

        return filter;

    }

    /**
     *  Take a hash or number and search for:
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