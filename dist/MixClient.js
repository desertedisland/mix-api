'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MixConnector2 = require('./MixConnector.js');

var _MixConnector3 = _interopRequireDefault(_MixConnector2);

var _MixSystemStats = require('./MixSystemStats.js');

var _MixSystemStats2 = _interopRequireDefault(_MixSystemStats);

var _MixSearch = require('./MixSearch.js');

var _MixSearch2 = _interopRequireDefault(_MixSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Core library for interactions with Ethereum blockchains

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
var MixClient = function (_MixConnector) {
    _inherits(MixClient, _MixConnector);

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

        var _this = _possibleConstructorReturn(this, (MixClient.__proto__ || Object.getPrototypeOf(MixClient)).call(this));

        try {

            _this.blockchainConnect(nodeURI, web3Object);
        } catch (err) {

            console.error(err);
            return _possibleConstructorReturn(_this);
        }

        // Instantiate libraries
        _this._systemStats = new _MixSystemStats2.default(_this.web3);
        _this._mixSearch = new _MixSearch2.default(_this.web3);

        return _this;
    }

    /**
     * Determine which blockchain the client is connected to by matching the hash
     * of block 192001 from the connected blockchain to known blockchains
     *
     * @returns {Promise}
     */

    _createClass(MixClient, [{
        key: 'getBlockchainName',
        value: function getBlockchainName() {
            var _this2 = this;

            var IDENTIFYING_BLOCK = 1920001,
                blockchainHashes = {
                '0x7644ba8795e260e7c4ad9f7e72aa1d0856f914f1a4847fb903aa504da29f9d22': 'Mix',
                '0x87b2bc3f12e3ded808c6d4b9b528381fa2a7e95ff2368ba93191a9495daa7f50': 'Ethereum',
                '0xab7668dfd3bedcf9da505d69306e8fd12ad78116429cf8880a9942c6f0605b60': 'Ethereum Classic'
            };

            return new Promise(function (resolve, reject) {

                // The Ethereum hard fork was at block 1920000. Therefore the block at 1920001 will have a different hash
                // depending on whether it is from the Ethereum or Ethereum classic blockchain.
                _this2.getBlock(IDENTIFYING_BLOCK).then(function (block) {

                    if (!block) return _this2.getBlock(1);

                    resolve(blockchainHashes[block.hash]);
                }).then(function (firstBlock) {

                    if (!firstBlock || !blockchainHashes[firstBlock.hash]) {

                        return resolve('Unknown blockchain');
                    }

                    resolve(blockchainHashes[firstBlock.hash]);
                });
            });
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

            var filter = this.web3.eth.filter('latest');

            filter.watch(function (error, result) {

                if (error) {
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
            var _this3 = this;

            var latestBlocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


            // Must get system state before everything else.
            return new Promise(function (resolve, reject) {

                var stats = {};

                _this3._systemStats.getState().then(function (state) {

                    stats.state = state;

                    var promises = [_this3._systemStats.getPeerCount(), _this3._systemStats.getGasPrice()];

                    if (!latestBlocks) {
                        promises.push(_this3._systemStats.getLatestBlocks());
                    }

                    Promise.all(promises).then(function (results) {

                        stats.peerCount = results[0];
                        stats.gasPrice = results[1];

                        stats.latestBlocks = latestBlocks || results[2];

                        stats.difficulty = _this3._systemStats.getAverageDifficulty(stats.latestBlocks);
                        stats.blockTimes = _this3._systemStats.getBlockTimes(stats.latestBlocks);
                        stats.hashRate = _this3._systemStats.getHashRate();

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

        /**
         * Returns the last ten blocks of the blockchain
         *
         * @returns {Promise}
         */

    }, {
        key: 'getBlocks',
        value: function getBlocks() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {

                _this4._systemStats.getState().then(function () {

                    _this4._systemStats.getLatestBlocks().then(function (latestBlocks) {

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
}(_MixConnector3.default);

exports.default = MixClient;