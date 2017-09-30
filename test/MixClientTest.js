
/*
    Unit tests for the MixClient API

    - These tests use the transpiled files in the /dist folder
        - You will need to run 'npm run prepublish' to transpile the files in the /src folder
          if you make any changes.

 */


var chai = require('chai'),
    expect = chai.expect,
    Web3 = require('./web3-mock'),         // Use web3-mock for testing
    MixClient = require('../dist/MixClient').default;

describe('Mix API',
    function(){

        var mixClient = null,
            web3 = new Web3('https://localhost:8545');

        it('Should connect to a blockchain',
            function(){

                mixClient = new MixClient('', web3);
                expect(mixClient.isConnected()).to.equal(true);

            }
        );

        it('Should have retrieved the network stats',
            function(done){

                let stats = null;

                mixClient.getSystemStats().then(
                    function(stats){

                        console.log(stats);

                        expect(stats.state).to.equal('synchronised');
                        expect(stats.gasPrice).to.equal(10);
                        expect(stats.latestBlocks.length).to.equal(10);

                        done();

                    }
                );


            }
        )


    }
);
