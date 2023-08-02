const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const dotenv = require("dotenv");
const path = require("path");
const buildPath = path.resolve(__dirname, "..", "build");
const CampaignFactory = require(path.join(buildPath, "CampaignFactory.json"));
const fs = require("fs-extra");

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const provider = new HDWalletProvider(
  process.env.SECRET_MNEMONIC,
  process.env.NETWORK_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
  const constantPath = path.resolve(__dirname, "..", "constants.js");
  fs.removeSync(constantPath);
  const accounts = await web3.eth.getAccounts();
  const contract = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({
      data: CampaignFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  fs.ensureFileSync(constantPath);
  const content = `export const campaignFactoryAddress = "${contract.options.address}"`;
  fs.writeFileSync(constantPath, content);
  provider.engine.stop();
};

deploy();
