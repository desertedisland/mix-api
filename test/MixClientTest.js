
var chai = require('chai'),
    expect = chai.expect,
    Web3 = require('../lib/web3mock'),
    web3Test = null;

describe('Mix web3 client',
    function(){

        it('Should require a provider to be provided to the constructor',
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
