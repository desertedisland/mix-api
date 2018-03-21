'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// MixConnector - A library to connect to an Ethereum based block chain.
// Currently the connection is to a node specified by IP - connection methods will be added in the future
// hence the abstract base class.

// Abstract base class to allow for different connection methods
var MixConnectorBase = function MixConnectorBase() {
        _classCallCheck(this, MixConnectorBase);

        if (new.target === 'MixConnectorBase') {
                throw new TypeError("Cannot construct Abstract instances directly");
        }

        if (this.httpConnect === 'undefined') {
                throw new TypeError("Connect method must be implemented");
        }
};

var MixConnector = function (_MixConnectorBase) {
        _inherits(MixConnector, _MixConnectorBase);

        function MixConnector() {
                _classCallCheck(this, MixConnector);

                return _possibleConstructorReturn(this, (MixConnector.__proto__ || Object.getPrototypeOf(MixConnector)).call(this));
        }

        _createClass(MixConnector, [{
                key: 'blockchainConnect',
                value: function blockchainConnect() {
                        var nodeURI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                        var web3Object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


                        var uri = nodeURI;

                        this.web3 = null;

                        // Next see if a node URI has been set in localStorage. (localStorage will be undefined in tests)
                        if (!uri && typeof localStorage !== 'undefined') {

                                uri = localStorage.getItem('mix-node-uri');
                        }

                        // If web3Object has been supplied, that takes precedence over everything else.
                        if (web3Object) {
                                this.web3 = web3Object;
                        }

                        // If nodeURI has been supplied, attempt to connect with that.
                        if (uri && !this.web3) {

                                this.httpConnect(uri);
                        }

                        // No other option specified. Use metamask (web3 will be defined in global context)
                        if (!this.web3 && typeof web3 !== 'undefined') {

                                this.web3 = web3;
                        }

                        // No connection. Connect to public Ethereum node
                        if (!this.web3) this.httpConnect('https://api.myetherapi.com/eth');

                        // Test connection
                        if (!this.web3 || !this.web3.isConnected()) {
                                throw new Error('Not connected to network');
                        }

                        return this.web3;
                }
        }, {
                key: 'httpConnect',
                value: function httpConnect(nodeURI) {

                        var Web3 = require('web3');

                        try {

                                this.web3 = new Web3(new Web3.providers.HttpProvider(nodeURI));
                        } catch (err) {

                                console.error(err.message);
                        }

                        return this.web3;
                }

                /**
                 * Determine if the client is connected to an Ethereum provider
                 *
                 * @returns {Boolean}
                 */

        }, {
                key: 'isConnected',
                value: function isConnected() {

                        return this.web3.isConnected();
                }
        }]);

        return MixConnector;
}(MixConnectorBase);

exports.default = MixConnector;