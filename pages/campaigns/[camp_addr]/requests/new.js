import React, { useState } from "react";
import Layout from "../../../../components/Layout";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../../../../ethereum/web3";
import campaign from "../../../../ethereum/campaign";
import { useRouter } from "next/router";
import Link from "next/link";

const NewRequest = (props) => {
  const [amount, setAmount] = useState(0);
  const [addr, setAddr] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const generateRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isNaN(amount))
        throw Error("Enter a valid amount in Numerical Format!!!");
      if (!web3.utils.isAddress(addr.trim())) {
        console.log(addr);
        throw Error("Enter a valid address to create request!!!");
      }
      let accounts = await web3.eth.getAccounts();
      await campaign(props.camp_addr)
        .methods.createRequest(
          addr.trim(),
          web3.utils.toWei(amount),
          description
        )
        .send({
          from: accounts[0],
        });
      alert("Created Fund Request Successfully ");
      setAmount("");
      router.replace(`/campaigns/${address}/requests`); //For updating the content on the screen
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <Link href={`/campaigns/${props.camp_addr}/requests`}>
        <a>
          <Button primary>Go Back</Button>
        </a>
      </Link>
      <h3>Add a new Request</h3>
      <Form error={error.length > 0}>
        <Form.Field>
          <label>Receivers Address</label>
          <Input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder={
              "Enter the wallet address to whom funds are to be transferred"
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"Enter the reason for fund request."}
          />
        </Form.Field>
        {/* <Form.Field>

            <label>Description<label>
            <Input />
            </Form.Field> */}

        <Form.Field>
          <label>Request Amount</label>
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
          onClick={generateRequest}
          primary
        >
          Create Request
        </Button>
      </Form>
    </Layout>
  );
};

NewRequest.getInitialProps = async (context) => {
  return {
    camp_addr: context.query["camp_addr"],
  };
};

export default NewRequest;
