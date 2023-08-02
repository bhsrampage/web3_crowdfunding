const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const path = require("path");
const buildPath = path.resolve(__dirname, "..", "ethereum", "build");
const CampaignFactory = require(path.join(buildPath, "CampaignFactory.json"));
const Campaign = require(path.join(buildPath, "Campaign.json"));

const web3 = new Web3(ganache.provider());

let accounts;
let campaignFactory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  campaignFactory = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({ data: CampaignFactory.bytecode })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  await campaignFactory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await campaignFactory.methods.getCampaigns().call();
  campaign = new web3.eth.Contract(Campaign.abi, campaignAddress);
});

describe("Campaign", () => {
  it("deploys a campaign", () => {
    assert.ok(campaign.options.address);
  });

  it("marks callers as manager", async () => {
    assert.equal(await campaign.methods.manager().call(), accounts[0]);
  });

  it("allows contributions", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "101",
    });

    assert.ok(await campaign.methods.approvers(accounts[1]).call());
  });

  it("requires minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "99",
      });
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it("allows making requests", async () => {
    await campaign.methods
      .createRequest(
        accounts[2],
        Web3.utils.toWei("2"),
        "Want to purchase some goods"
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    let request = await campaign.methods.requests(0).call();
    assert.equal(request.recepient, accounts[2]);
  });

  it("requesting flow", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: Web3.utils.toWei("3"),
    });

    await campaign.methods
      .createRequest(
        accounts[2],
        Web3.utils.toWei("2"),
        "Want to purchase some goods"
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    let initialBalance = await web3.eth.getBalance(accounts[2]);
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
    });
    let finalBalance = await web3.eth.getBalance(accounts[2]);
    assert.equal(
      parseInt(Web3.utils.fromWei(finalBalance)) -
        parseInt(Web3.utils.fromWei(initialBalance)),
      2
    );
    assert.ok((await campaign.methods.requests(0).call()).complete);
  });
});
