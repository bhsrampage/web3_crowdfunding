import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
import { campaignFactoryAddress } from "./constants";

const campaignFactory = new web3.eth.Contract(
  CampaignFactory.abi,
  campaignFactoryAddress
);

export default campaignFactory;
