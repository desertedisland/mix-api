
// Need to use commonjs imports for NPM

var client = require('./src/MixClient'),
    connector = require('./src/MixConnector'),
    contracts = {
        MixinRegistryContract : require('./src/contracts/MixinRegistryContract')
    };

module.exports = {
    MixClient : client.default,
    MixConnector : connector.default,
    MixContracts : contracts
};