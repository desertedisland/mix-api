'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Core library for interactions with Ethereum blockchains

var _MixConnector = require('./MixConnector.js');

var _MixConnector2 = _interopRequireDefault(_MixConnector);

var _MixSystemStats = require('./MixSystemStats.js');

var _MixSystemStats2 = _interopRequireDefault(_MixSystemStats);

var _MixSearch = require('./MixSearch.js');

var _MixSearch2 = _interopRequireDefault(_MixSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Provide high level functionality for MIX blockchain interfaces
 *
 * @class
 *
 */
var MixClient = function () {

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
    function MixClient() {
        var nodeURI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var web3Object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, MixClient);

        // If a web3 object has been supplied as a param, use that over other methods.
        this._web3 = null;

        // First see if a node URI is supplied by param
        var nodeUri = nodeURI || null;

        // Next see if a node URI has been set in localStorage. (localStorage will be undefined in tests)
        if (!nodeURI && typeof localStorage !== 'undefined') {

            nodeURI = localStorage.getItem('mix-node-uri');
        }

        // If web3Object has been supplied, that takes precedence over everything else.
        if (web3Object) {
            this._web3 = web3Object;
        }

        // If nodeURI has been supplied, attempt to connect with that.
        if (nodeUri && !this._web3) {

            this._web3 = _MixConnector2.default.connect(nodeUri);
        }

        // No other option specified. Use metamask.
        if (!this._web3 && typeof web3 !== 'undefined') {

            this._web3 = web3;
        }

        // Test connection
        if (!this._web3 || !this._web3.isConnected()) {
            throw new Error('Not connected to network');
        }

        this._systemStats = new _MixSystemStats2.default(this._web3);
        this._mixSearch = new _MixSearch2.default(this._web3);
    }

    /**
     * Determine if the client is connected to an Ethereum provider
     *
     * @returns {Boolean}
     */

    _createClass(MixClient, [{
        key: 'isConnected',
        value: function isConnected() {

            return this._web3.isConnected();
        }

        /**
         * Watch the network for new blocks
         *
         * @param {function} callback
         * @param {function} errorCallback
         * @returns {Object} filter
         */

    }, {
        key: 'watchNetwork',
        value: function watchNetwork(callback, errorCallback) {

            var filter = this._web3.eth.filter('latest');

            filter.watch(function (error, result) {

                if (error) {
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

    }, {
        key: 'doSearch',
        value: function doSearch(query) {

            var promises = [this._mixSearch.getBlock(query), this._mixSearch.getBalance(query), this._mixSearch.getTransaction(query)];

            return new Promise(function (resolve, reject) {

                Promise.all(promises).then(function (results) {

                    resolve({
                        block: results[0],
                        account: results[1],
                        transaction: results[2]
                    });
                }).catch(function (error) {

                    reject(error);
                });
            });
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

    }, {
        key: 'getSystemStats',
        value: function getSystemStats() {
            var _this = this;

            var latestBlocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


            // Must get system state before everything else.
            return new Promise(function (resolve, reject) {

                var stats = {};

                _this._systemStats.getState().then(function (state) {

                    stats.state = state;

                    var promises = [_this._systemStats.getPeerCount(), _this._systemStats.getGasPrice()];

                    if (!latestBlocks) {
                        promises.push(_this._systemStats.getLatestBlocks());
                    }

                    Promise.all(promises).then(function (results) {

                        stats.peerCount = results[0];
                        stats.gasPrice = results[1];

                        stats.latestBlocks = latestBlocks || results[2];

                        stats.difficulty = _this._systemStats.getAverageDifficulty(stats.latestBlocks);
                        stats.blockTimes = _this._systemStats.getBlockTimes(stats.latestBlocks);
                        stats.hashRate = _this._systemStats.getHashRate();

                        resolve(stats);
                    }).catch(function (error) {

                        console.error(error.message);
                        reject(error);
                    });
                });
            });
        }

        /**
         * Add a new block to the latestBlocks list and update the system stats
         *
         * @param {Array} latestBlocks - a list of Ethereum blocks
         * @returns {Promise}
         */

    }, {
        key: 'updateBlocks',
        value: function updateBlocks(latestBlocks) {

            this._systemStats.setLatestBlocks(latestBlocks);

            // Returns promise
            return this.getSystemStats(latestBlocks);
        }
    }, {
        key: 'getBlocks',
        value: function getBlocks() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

                _this2._systemStats.getState().then(function () {

                    _this2._systemStats.getLatestBlocks().then(function (latestBlocks) {

                        resolve(latestBlocks);
                    });
                });
            });
        }

        /**
         * Return an Ethereum block based on block hash or number
         *
         * @param {String} hashOrNumber
         * @returns {Promise}
         */

    }, {
        key: 'getBlock',
        value: function getBlock(hashOrNumber) {

            // Returns promise
            return this._mixSearch.getBlock(hashOrNumber);
        }

        /**
         * Retrieve a transaction by transaction hash
         *
         * @param {String} transactionHash
         * @returns {Promise}
         */

    }, {
        key: 'getTransaction',
        value: function getTransaction(transactionHash) {

            // Returns promise
            return this._mixSearch.getTransaction(transactionHash);
        }

        /**
         * Retrieve the balance for an account at accountHash
         *
         * @param {String} accountHash
         * @returns {Promise}
         */

    }, {
        key: 'getAccountBalance',
        value: function getAccountBalance(accountHash) {

            // Returns promise
            return this._mixSearch.getBalance(accountHash);
        }
    }]);

    return MixClient;
}();

exports.default = MixClient;