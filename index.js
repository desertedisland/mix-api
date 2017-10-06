
var client = require('./src/MixClient'),
    connector = require('./src/MixConnector');

module.exports = {
    MixClient : client.default,
    MixConnector : connector.default
};