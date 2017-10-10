

const MixinRegistryABI = [{
    "constant": true,
    "inputs": [{
        "name": "mixinId",
        "type": "uint256"
    }, {
        "name": "maxAncestors",
        "type": "uint256"
    }],
    "name": "getAncestors",
    "outputs": [{
        "name": "ancestors",
        "type": "uint256[]"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "mixinId",
        "type": "uint256"
    }],
    "name": "getParent",
    "outputs": [{
        "name": "parent",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "mixinId",
        "type": "uint256"
    }],
    "name": "getExists",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "parent",
        "type": "uint256"
    }, {
        "name": "uri",
        "type": "string"
    }, {
        "name": "description",
        "type": "string"
    }],
    "name": "addMixin",
    "outputs": [{
        "name": "mixinId",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getCount",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "mixinId",
        "type": "uint256"
    }],
    "name": "getMixin",
    "outputs": [{
        "name": "parent",
        "type": "uint256"
    }, {
        "name": "uri",
        "type": "string"
    }, {
        "name": "description",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "name": "uri",
        "type": "string"
    }, {
        "name": "description",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "mixinId",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "parent",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "uri",
        "type": "string"
    }, {
        "indexed": false,
        "name": "description",
        "type": "string"
    }],
    "name": "NewMixin",
    "type": "event"
}];
const MixinRegistryAddress = "0x99be57fca49270b69306cdbe89df416d769dbd06";

const TestMixinRegistryAddress = '0x1eda349959248aa94f755bc4c7da9201a5336171';

export{ MixinRegistryABI, TestMixinRegistryAddress };
