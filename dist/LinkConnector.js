'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// LinkConnector - A library to connect to an Ethereum based block chain.
// Currently the connection is to a node specified by IP - connection methods will be added in the future
// hence the abstract base class.

var web3 = require('web3');

// Abstract base class to allow for different connection methods

var LinkConnectorBase = function LinkConnectorBase() {
    _classCallCheck(this, LinkConnectorBase);

    if (new.target === 'LinkConnectorBase') {
        throw new TypeError("Cannot construct Abstract instances directly");
    }

    if (this.connect === 'undefined') {
        throw new TypeError("Connect method must be implemented");
    }
};

var LinkHTTPConnector = function (_LinkConnectorBase) {
    _inherits(LinkHTTPConnector, _LinkConnectorBase);

    function LinkHTTPConnector() {
        _classCallCheck(this, LinkHTTPConnector);

        return _possibleConstructorReturn(this, (LinkHTTPConnector.__proto__ || Object.getPrototypeOf(LinkHTTPConnector)).call(this));
    }

    _createClass(LinkHTTPConnector, null, [{
        key: 'connect',
        value: function connect(nodeURI) {

            try {

                return new Web3(new Web3.providers.HttpProvider(nodeURI));
            } catch (err) {

                console.error(err.message);
                return null;
            }
        }
    }]);

    return LinkHTTPConnector;
}(LinkConnectorBase);

exports.default = LinkHTTPConnector;