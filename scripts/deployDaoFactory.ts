import { Contract, Signer } from "locklift";
import { FactorySource } from "../build/factorySource";


let signer: Signer;
let daoFactoryDeployer: Contract<FactorySource["DaoFactory"]>;


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

}

main()
.then(() => process.exit(0))
.catch(e => {
  console.log(e);
  process.exit(1);
});