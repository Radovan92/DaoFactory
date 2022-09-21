import { Contract, Signer } from "locklift";
import { FactorySource } from "../build/factorySource";


let signer: Signer;
let daoFactoryDeployer: Contract<FactorySource["DaoFactory"]>;
let owner: Contract<FactorySource["Wallet"]>;
let accountsFactory = locklift.factory.getAccountsFactory(
  "Wallet", // name of contract used as a wallet
);
const main = async () => {
    

  const signer = (await locklift.keystore.getSigner("0"))!;
  const _randomNonce = locklift.utils.getRandomNonce();

  

  const { contract } = await locklift.factory.deployContract({
    contract: "DaoFactory",
    publicKey: signer.publicKey,
    initParams: {
    _nonce: _randomNonce,
    },
    constructorParams: {},
    value: locklift.utils.toNano(10),
});
daoFactoryDeployer = contract;
console.log(`Dao factory deployed at: ${daoFactoryDeployer.address.toString()}`);

	const {account} = await accountsFactory.deployNewAccount({
  		value: locklift.utils.toNano(10),
  		publicKey: signer.publicKey,
  		initParams: {
  			_randomNonce: locklift.utils.getRandomNonce(),
  		},
  		constructorParams: {},
  		});
  		owner = account;
    owner.publicKey = signer.publicKey;
    
    console.log(`Owner address: ${owner.address}`);
    const daoRootPlatform = locklift.factory.getContractArtifacts("DaoRoot");
    const trans = await owner.runTarget
    ({contract: daoFactoryDeployer,
    		value: locklift.utils.toNano(2.2),
    		publicKey: signer.publicKey,
    		},
    		daoFactoryDeployer =>
    			daoFactoryDeployer.methods.deploy({ 
    				platformCode_: daoRootPlatform.code, 
    				proposalConfiguration_: {
    					votingDelay: 10,
    					votingPeriod: 10000,
    					quorumVotes: 50,
    					timeLock: 1000,
    					threshold: 50,
    					gracePeriod: 100
    				}, 
    				}),
    		);
    		
    	const daoAddr = await daoFactoryDeployer.methods.getDaoRoot({}).call();
    	console.log(daoAddr);
}

main()
.then(() => process.exit(0))
.catch(e => {
  console.log(e);
  process.exit(1);
});
