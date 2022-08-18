import { Contract, Signer } from "locklift";
import { FactorySource } from "../build/factorySource";

const {
    afterRun,
} = require('./../test/utils');
const {load} = require('csv-load-sync');
const {use} = require("chai");

const prompts = require('prompts');
const _ = require('underscore');
const fs  = require("fs");
const { parse } = require('csv-parse/lib/sync');

const isValidTonAddress = (address) => /^(?:-1|0):[0-9a-fA-F]{64}$/.test(address);
let signer: Signer;
let owner: Contract<FactorySource["Wallet"]>;
let daoFactoryCon: Contract<FactorySource["DaoFactory"]>;

let daoFactoryDeployer: Contract<FactorySource["DaoFactory"]>;

let root: Contract<FactorySource["TokenRoot"]>;


const main = async () => {
    

  const signer = (await locklift.keystore.getSigner("0"))!;
  const _randomNonce = locklift.utils.getRandomNonce();

  let accountsFactory = await locklift.factory.getAccountsFactory("Wallet");

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
console.log(`Airdrop factory deployed at: ${daoFactoryDeployer.address.toString()}`);

}

main()
.then(() => process.exit(0))
.catch(e => {
  console.log(e);
  process.exit(1);
});