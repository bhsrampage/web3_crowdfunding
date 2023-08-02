const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "..", "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "..", "contracts", "Campaign.sol");
const source = fs.readFileSync(contractPath, "utf-8");
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    {
      abi: JSON.parse(output[contract].interface),
      bytecode: output[contract].bytecode,
    }
  );
}
