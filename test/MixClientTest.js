
/*
    Unit tests for the MixClient API

    - These tests use the transpiled files in the /dist folder
        - You will need to run 'npm run prepublish' to transpile the files in the /src folder
          if you make any changes.

 */


var chai = require('chai'),
    expect = chai.expect,
    Web3 = require('../lib/web3mock'),         // Use web3-mock for testing
    mixClient = require('../dist/MixClient');

describe('Mix API',
    function(){

        it('Should connect to a web3 object',
            function(){

                expect(
                    function(){

                        Web3()

                    }
                ).to.throw();

            }
        );


    }
);
