'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Core library for interactions with Ethereum blockchains

var _LinkConnector = require('./LinkConnector.js');

var _LinkConnector2 = _interopRequireDefault(_LinkConnector);

var _LinkSystemStats = require('./LinkSystemStats.js');

var _LinkSystemStats2 = _interopRequireDefault(_LinkSystemStats);

var _LinkSearch = require('./LinkSearch.js');

var _LinkSearch2 = _interopRequireDefault(_LinkSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkClient = function () {

    // Connect to a network via Metamask (https://metamask.io/) or explicit URI stored in localstorage.
    // Explicit URI overrides Metamask.
    function LinkClient() {
        var nodeURI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, LinkClient);

        this._web3 = null;

        // If a node URI has been specified, it will be stored in localstorage
        var nodeUri = nodeURI || localStorage.getItem('link-node-uri');

        if (nodeUri) {

            this._web3 = _LinkConnector2.default.connect(nodeUri);

            // No direct connection specified. Try metamask.
        } else if (typeof web3 !== 'undefined') {

            this._web3 = web3;
        }

        if (!this._web3 || !this._web3.isConnected()) {
            throw new Error('Not connected to network');
        }

        this._systemStats = new _LinkSystemStats2.default(this._web3);
        this._linkSearch = new _LinkSearch2.default(this._web3);
    }

    // Watch the network for new blocks


    _createClass(LinkClient, [{
        key: 'watchNetwork',
        value: function watchNetwork(callback, errorCallback) {

            var filter = this._web3.eth.filter('latest'),
                that = this;

            filter.watch(function (error, result) {

                if (error) {
                    return errorCallback(error);
                }

                callback(result);
            });

            return filter;
        }

        // Take a hash or number and search for:
        // - An account balance
        // - A transaction
        // - A block

    }, {
        key: 'doSearch',
        value: function doSearch(query) {

            var promises = [this._linkSearch.getBlock(query), this._linkSearch.getBalance(query), this._linkSearch.getTransaction(query)];

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

        // Numerous asynchronous calls to various APIs. getLatestBlocks will initially
        // make an asynchronous call to retrieve each individual block (I'm not aware of any other way
        // of doing that with the web3 api). You can avoid that if you supply an existing list of
        // latestBlocks via the param.

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

        // Add a new block to the latestBlocks list and update the stats
        // Update the block list and stats with a new block

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
    }, {
        key: 'getBlock',
        value: function getBlock(hashOrNumber) {

            // Returns promise
            return this._linkSearch.getBlock(hashOrNumber);
        }
    }, {
        key: 'getTransaction',
        value: function getTransaction(transactionHash) {

            // Returns promise
            return this._linkSearch.getTransaction(transactionHash);
        }
    }, {
        key: 'getAccountBalance',
        value: function getAccountBalance(accountHash) {

            // Returns promise
            return this._linkSearch.getBalance(accountHash);
        }
    }]);

    return LinkClient;
}();

exports.default = LinkClient;