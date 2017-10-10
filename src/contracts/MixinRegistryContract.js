
import MixContract from './MixContract'

import {MixinRegistryABI, MixinRegistryAddress} from './MixinRegistryABI';

export default class MixinRegistryContract extends MixContract{

    constructor(web3){

        if(!web3 || !web3.isConnected()){

            throw new Error('Contract requires blockchain connection');
        }

        super();

        this.web3 = web3;

    }

    contractConnect(){

        const contract = this.web3.eth.contract(MixinRegistryABI);
        this.mixinRegistryContract = contract.at(MixinRegistryAddress);

    }

    addMixin({ parentId, uri, description }){

        return new Promise(
            (resolve, reject)=>{

                this.mixinRegistryContract.addMixin(parentId, uri, description,
                    (error, response)=>{

                        if(error) return reject(error.message);

                        resolve(response);
                    }

                )

            }
        )


    }

    getMixinCount(){

        const count = this.mixinRegistryContract.getCount(
            (error, response)=>{

                if(error) return console.error(error.message);

                console.log(response.toString());

            }
        );

    }

    getMixin(){



    }


}


