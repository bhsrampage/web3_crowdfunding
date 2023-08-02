import React, { useEffect, useState } from "react";
import campaignFactory from "../ethereum/campaignFactory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

const CampaignIndex = ({ campaigns }) => {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setItems(
      campaigns.map((item, index) => {
        return {
          header: item,
          description: <Link href={`/campaigns/${item}`}>View Campaign</Link>,
          fluid: true,
        };
      })
    );
  }, []);

  return (
    <div>
      <Layout>
        <h3>Open Campaigns</h3>
        <Link href={"/campaigns/new"}>
          <a>
            <Button
              content="Create Campaign"
              icon="plus"
              labelPosition="right"
              primary
              floated="right"
            />
          </a>
        </Link>
        <Card.Group items={items} />
      </Layout>
    </div>
  );
};

CampaignIndex.getInitialProps = async () => {
  let campaigns = await campaignFactory.methods.getCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
