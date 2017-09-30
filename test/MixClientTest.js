
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

                        expect(stats.state).to.equal('synchronised');
                        expect(stats.gasPrice).to.equal(10);
                        expect(stats.latestBlocks.length).to.equal(10);

                        done();

                    }
                );


            }
        );

        it('Should retrieve a transaction',
            function(done){

                var transaction = '0xc977a829b78f0a7c039441465202fff990687f10e3dbef0987ed5ded9bc511f7';

                mixClient.getTransaction(transaction).then(
                    function(transaction){

                        expect(transaction.to).to.equal('0xfa3caabc8eefec2b5e2895e5afbf79379e7268a7');
                        done();
                    }
                )

            }
        );

        it('Should retrieve a block',
            function(done){

                mixClient.getBlock(2742).then(
                    function(block){

                        console.log(block);
                        expect(block.number).to.equal(2742);

                        done();
                    },
                    function(error){
                        console.error(error);

                        done();
                    }
                )

            }
        )





    }
);
