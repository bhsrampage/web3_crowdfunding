import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import campaignFactory from "../../ethereum/campaignFactory";
import web3 from "../../ethereum/web3";

const New = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isNaN(amount))
        throw Error("Enter a valid amount in Numerical Format!!!");
      let accounts = await web3.eth.getAccounts();
      await campaignFactory.methods
        .createCampaign(web3.utils.toWei(amount))
        .send({
          from: accounts[0],
          gas: "1000000",
        });
      alert("Campaign Created Successfully ");
      setAmount("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h1>New Campaign</h1>
      <Form error={error.length > 0}>
        <Form.Field>
          <label>Enter Minimum Contribution amount</label>
          <Input
            label="eth"
            labelPosition="right"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></Input>
        </Form.Field>
        <Message error header="Oops!!" content={error} />
        <Button
          type="submit"
          loading={loading}
          onClick={createCampaign}
          primary
        >
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default New;
