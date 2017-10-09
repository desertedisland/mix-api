
// Need to use commonjs imports for NPM

var client = require('./src/MixClient'),
    connector = require('./src/MixConnector'),
    contracts = {
        MixinRegistryContract : require('./src/contracts/MixinRegistryContract').default
    };

module.exports = {
    MixClient : client.default,
    MixConnector : connector.default,
    mixContracts : contracts
};