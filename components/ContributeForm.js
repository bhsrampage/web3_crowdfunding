import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import campaign from "../ethereum/campaign";
import { useRouter } from "next/router";

const ContributeForm = ({ address }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const contribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isNaN(amount))
        throw Error("Enter a valid amount in Numerical Format!!!");
      let accounts = await web3.eth.getAccounts();
      await campaign(address)
        .methods.contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(amount),
        });
      alert("Contributed to campaign Successfully ");
      setAmount("");
      router.replace(`/campaigns/${address}`); //For updating the content on the screen
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Form error={error.length > 0}>
      <Form.Field>
        <label>Enter Contribution amount</label>
        <Input
          label="eth"
          labelPosition="right"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        ></Input>
      </Form.Field>
      <Message error header="Oops!!" content={error} />
      <Button type="submit" loading={loading} onClick={contribute} primary>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
