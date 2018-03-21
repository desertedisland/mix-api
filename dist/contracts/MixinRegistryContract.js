'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MixContract2 = require('./MixContract');

var _MixContract3 = _interopRequireDefault(_MixContract2);

var _MixinRegistryABI = require('./MixinRegistryABI');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MixinRegistryContract = function (_MixContract) {
    _inherits(MixinRegistryContract, _MixContract);

    function MixinRegistryContract(web3) {
        _classCallCheck(this, MixinRegistryContract);

        if (!web3 || !web3.isConnected()) {

            throw new Error('Contract requires blockchain connection');
        }

        var _this = _possibleConstructorReturn(this, (MixinRegistryContract.__proto__ || Object.getPrototypeOf(MixinRegistryContract)).call(this));

        _this.web3 = web3;

        return _this;
    }

    _createClass(MixinRegistryContract, [{
        key: 'contractConnect',
        value: function contractConnect() {

            var contract = this.web3.eth.contract(_MixinRegistryABI.MixinRegistryABI);
            this.mixinRegistryContract = contract.at(_MixinRegistryABI.MixinRegistryAddress);

            // Create event watcher
            this.contractEvents = this.mixinRegistryContract.allEvents();
        }
    }, {
        key: 'contractWatch',
        value: function contractWatch(callBack) {

            this.contractEvents.watch(function (error, log) {

                if (error) return console.error(error);

                console.log(log);
            });
        }
    }, {
        key: 'contractStopWatching',
        value: function contractStopWatching() {

            this.contractEvents.stopWatching();
        }
    }, {
        key: 'addMixin',
        value: function addMixin(_ref) {
            var _this2 = this;

            var parentId = _ref.parentId,
                uri = _ref.uri,
                description = _ref.description;


            return new Promise(function (resolve, reject) {

                _this2.mixinRegistryContract.addMixin(parentId, uri, description, function (error, response) {

                    if (error) return reject(error.message);

                    resolve(response);
                });
            });
        }
    }, {
        key: 'getMixinCount',
        value: function getMixinCount() {

            var count = this.mixinRegistryContract.getCount(function (error, response) {

                if (error) return console.error(error.message);

                console.log(response.toString());
            });
        }
    }, {
        key: 'getMixin',
        value: function getMixin() {}
    }]);

    return MixinRegistryContract;
}(_MixContract3.default);

exports.default = MixinRegistryContract;