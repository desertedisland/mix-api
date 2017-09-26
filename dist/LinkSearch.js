"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Search functions for the block chain

var LinkSearch = function () {
    function LinkSearch(web3) {
        _classCallCheck(this, LinkSearch);

        this._web3 = web3;
    }

    _createClass(LinkSearch, [{
        key: "getBlock",
        value: function getBlock(hashOrNumber) {
            var _this = this;

            return new Promise(function (resolve, reject) {

                _this._web3.eth.getBlock(hashOrNumber, true, function (error, block) {

                    if (error || !block) return resolve(null);

                    resolve(block);
                });
            });
        }
    }, {
        key: "getTransaction",
        value: function getTransaction(hash) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

                if (hash.length < 64) return resolve(null);

                _this2._web3.eth.getTransaction(hash, function (error, transaction) {

                    if (error || !transaction) return resolve(null);

                    resolve(transaction);
                });
            });
        }
    }, {
        key: "getBalance",
        value: function getBalance(accountHash) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {

                if (!_this3._web3.isAddress(accountHash)) {
                    return resolve(null);
                }

                _this3._web3.eth.getBalance(accountHash, function (error, balance) {

                    if (error) return resolve(null);

                    // Balance is returned as big number.
                    var newBalance = _this3._web3.fromWei(balance, "ether");
                    resolve(newBalance.toString(10));
                });
            });
        }
    }]);

    return LinkSearch;
}();

exports.default = LinkSearch;