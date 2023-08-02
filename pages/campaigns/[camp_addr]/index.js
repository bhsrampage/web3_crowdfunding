import React from "react";
import { Button, Card, Grid, GridColumn } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import campaign from "../../../ethereum/campaign";
import Web3 from "web3";
import ContributeForm from "../../../components/ContributeForm";
import Link from "next/link";

const CampaignHome = (props) => {
  const items = [
    {
      description: "Manager can create requests",
      meta: "Address of the manager",
      header: props.managerAddr,
      style: { overflowWrap: "break-word" },
    },
    {
      meta: "Campaign Balance",
      description: "The eth that the contract currently holds",
      header: Web3.utils.fromWei(props.balance),
    },
    {
      meta: "Minimum Contribution",
      description: "You must contribute the minimum eth to participate",
      header: Web3.utils.fromWei(props.minimumContribution),
    },
    {
      meta: "Requests",
      header: props.numRequests,
      description: "Requests try to withdraw eth from the contract",
    },
    {
      meta: "Number of Contributors",
      header: props.numContributors,
      description: "People who have already donated the sum to the contract",
    },
  ];

  return (
    <Layout>
      <h1>Campaign at {props.camp_addr}</h1>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <GridColumn width={4}>
            <ContributeForm address={props.camp_addr} />
          </GridColumn>
        </Grid.Row>
        <Grid.Row>
          <Link href={`/campaigns/${props.camp_addr}/requests`}>
            <a>
              <Button content="View Requests" primary floated="right" />
            </a>
          </Link>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

CampaignHome.getInitialProps = async (context) => {
  const campaignContract = campaign(context.query["camp_addr"]);
  const resp = await campaignContract.methods.getSummary().call();

  return {
    balance: resp["0"],
    minimumContribution: resp["1"],
    numRequests: resp["2"],
    numContributors: resp["3"],
    managerAddr: resp["4"],
    camp_addr: context.query["camp_addr"],
  };
};

export default CampaignHome;
