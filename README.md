# mix-api
A wrapper of the [Ethereum web3 api](https://github.com/ethereum/wiki/wiki/JavaScript-API) for high level functions related to mix.

This module is intended primarily as an interface to Ethereum blockchain projects
for the MIX blockchain project but there are functions that will be useful to any Blockchain project.
Feel free to re-use, fork, submit pull requests, etc.

The api libraries (contained in the 'src' directory) are written in ES6.
In order to support older browsers these libraries are transpiled to ES5 via Babel
and placed in the 'dist' file. It is these (ES5) files that are exported via the
index.js file.

### npm commands

- `npm run prepublish` - Transpile libraries with Babel
- `npm test` - Unit tests