
var client = require('./dist/MixClient'),
    connector = require('./dist/MixConnector');

module.exports = {
    MixClient : client.default,
    MixConnector : connector.default
};