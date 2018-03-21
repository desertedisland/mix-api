
// Need to use commonjs imports for NPM

var client = require('./dist/MixClient'),
    connector = require('./dist/MixConnector'),
    contracts = {
        MixinRegistryContract : require('./dist/contracts/MixinRegistryContract').default
    };

module.exports = {
    MixClient : client.default,
    MixConnector : connector.default,
    mixContracts : contracts
};