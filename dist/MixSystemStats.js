'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MixSystemStats = function () {
    function MixSystemStats(web3) {
        _classCallCheck(this, MixSystemStats);

        this._web3 = web3;
    }

    // Function will determine the state of the system: 'synced' or 'synchronising'.
    // It is necessary to call this function before any of the others that require block calculations
    // as web3.eth.blockNumber (latest block) will be zero if the node is syncing (in that case use the
    // current block as the latest block).


    _createClass(MixSystemStats, [{
        key: 'getState',
        value: function getState() {
            var _this = this;

            var that = this;

            return new Promise(function (resolve, reject) {

                that._web3.eth.getSyncing(function (error, result) {

                    if (error) return reject(error);

                    if (result) {
                        // Still syncing

                        _this._syncing = true;
                        _this._latestBlockNumber = result.currentBlock;

                        return resolve('synchronising');
                    }

                    _this._syncing = false;

                    // Synchronised. Need to get the latest block number.
                    that._web3.eth.getBlockNumber(function (err, blockNumber) {

                        if (err) return reject(err);

                        _this._latestBlockNumber = blockNumber;
                        resolve('synchronised');
                    });
                });
            });
        }
    }, {
        key: 'getBlock',
        value: function getBlock(blockID) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

                _this2._web3.eth.getBlock(blockID, false, function (error, block) {

                    if (error) return reject(error);

                    resolve(block);
                });
            });
        }
    }, {
        key: 'getLatestBlocks',
        value: function getLatestBlocks() {
            var blocksToRetrieve = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;


            if (typeof this._syncing === 'undefined') {
                throw new Error('Must call system state to get latest blocks');
            }

            var promises = [];

            for (var i = this._latestBlockNumber - blocksToRetrieve; i <= this._latestBlockNumber; i++) {

                promises.push(this.getBlock(i));
            }

            return new Promise(function (resolve, reject) {

                Promise.all(promises).then(function (latestBlocks) {

                    // Blocks are returned asynchronously. Order them by timestamp
                    latestBlocks.sort(function (blocka, blockb) {

                        if (blocka.timestamp > blockb.timestamp) return 1;

                        return -1;
                    });

                    resolve(latestBlocks);
                }).catch(function (error) {

                    reject(error);
                });
            });
        }
    }, {
        key: 'setLatestBlocks',
        value: function setLatestBlocks(blocks) {

            this._latestBlocks = blocks;
        }
    }, {
        key: 'getBlockTimes',
        value: function getBlockTimes() {
            var _this3 = this;

            var latestBlocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


            if (latestBlocks) {
                this._latestBlocks = latestBlocks;
            }

            if (!this._latestBlocks || !this._latestBlocks.length) {
                throw new Error('Must retrieve latest blocks to determine block times');
            }

            var blockTimes = [];

            // Get individual block times at the same time as we figure out the average
            this._totalTime = this._latestBlocks.reduce(function (total, block, index) {

                var blockTime = 0;

                if (index !== 0) {

                    blockTime = _this3._latestBlocks[index].timestamp - _this3._latestBlocks[index - 1].timestamp;
                    blockTimes.push(blockTime);
                }

                return total + blockTime;
            }, 0);

            this._averageTime = this._totalTime / this._latestBlocks.length;

            return {
                blockTimes: blockTimes,
                average: this._averageTime
            };
        }
    }, {
        key: 'getAverageDifficulty',
        value: function getAverageDifficulty() {
            var latestBlocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


            if (latestBlocks) {
                this._latestBlocks = latestBlocks.filter(function (block) {
                    return block && block.difficulty;
                });
            }

            if (!this._latestBlocks || !this._latestBlocks.length) {
                throw new Error('Must retrieve latest blocks to determine difficulty');
            }

            this._difficultySum = this._latestBlocks.reduce(function (total, block) {

                return total + parseInt(block.difficulty.toString());
            }, 0);

            this._averageDifficulty = this._difficultySum / this._latestBlocks.length;
            return this._averageDifficulty;
        }
    }, {
        key: 'getPeerCount',
        value: function getPeerCount() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {

                _this4._web3.net.getPeerCount(function (error, peerCount) {

                    if (error) return reject(error);

                    resolve(peerCount);
                });
            });
        }
    }, {
        key: 'getSync',
        value: function getSync() {

            return this._web3.eth.syncing;
        }
    }, {
        key: 'getGasPrice',
        value: function getGasPrice() {
            var _this5 = this;

            return new Promise(function (resolve, reject) {

                _this5._web3.eth.getGasPrice(function (error, gasPrice) {

                    if (error) return reject(error);

                    // Price in gwei
                    resolve(parseInt(gasPrice.toString()) / 1000000000);
                });
            });
        }
    }, {
        key: 'getHashRate',
        value: function getHashRate() {

            if (!this._difficultySum || !this._totalTime) {
                throw new Error('Need difficulty and block time to calculate hashrate');
            }

            return this._difficultySum / this._totalTime;
        }
    }]);

    return MixSystemStats;
}();

exports.default = MixSystemStats;