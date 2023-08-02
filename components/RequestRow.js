import React, { useState } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import campaign from "../ethereum/campaign";
import { useRouter } from "next/router";

const RequestRow = ({ index, request, approvers, addr }) => {
  const { Cell, Row } = Table;
  const { recepient, value, description, complete, approvalCount } = request;
  const [approving, setApproving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const contract = campaign(addr);
  const router = useRouter();
  const isReadyforFinal = approvers === approvalCount;

  const approveRequest = async () => {
    setApproving(true);
    try {
      let accounts = await web3.eth.getAccounts();
      await contract.methods.approveRequest(index).send({ from: accounts[0] });
      alert("Request approved successfully !!");
      router.replace(`/campaigns/${addr}/requests`);
    } catch (error) {
      alert(error.message);
    }
    setApproving(false);
  };
  const finalizeRequest = async () => {
    setFinalizing(true);
    try {
      let accounts = await web3.eth.getAccounts();
      await contract.methods.finalizeRequest(index).send({ from: accounts[0] });
      alert("Request finalized successfully !!");
      router.replace(`/campaigns/${addr}/requests`);
    } catch (error) {
      alert(error.message);
    }
    setFinalizing(false);
  };

  return (
    <Row disabled={complete} positive={isReadyforFinal && !complete}>
      <Cell>{index}</Cell>
      <Cell>{recepient}</Cell>
      <Cell>{web3.utils.fromWei(value)}</Cell>
      <Cell>{description}</Cell>
      <Cell>
        {approvalCount}/{approvers}
      </Cell>
      <Cell>
        <Button
          disabled={complete || isReadyforFinal}
          onClick={approveRequest}
          loading={approving}
          color="green"
          basic
        >
          Approve
        </Button>
      </Cell>
      <Cell>
        <Button
          disabled={complete || !isReadyforFinal}
          onClick={finalizeRequest}
          loading={finalizing}
          color="teal"
        >
          Finalize
        </Button>
      </Cell>
    </Row>
  );
};

export default RequestRow;
