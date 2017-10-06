
// var client = require('./src/MixClient'),
//     connector = require('./src/MixConnector');

import MixClient from './src/MixClient.js';
import MixConnector from './src/MixConnector.js';

module.exports = {
    MixClient : client.default,
    MixConnector : connector.default
};