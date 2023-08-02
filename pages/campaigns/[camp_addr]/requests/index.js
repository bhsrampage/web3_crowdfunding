import React from "react";
import campaign from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import { Button, Table } from "semantic-ui-react";
import RequestRow from "../../../../components/RequestRow";

const RequestHome = (props) => {
  const { Header, Row, HeaderCell, Body } = Table;
  return (
    <Layout>
      <h1>Requests List for {props.camp_addr}</h1>
      <Link href={`/campaigns/${props.camp_addr}/requests/new`}>
        <a>
          <Button primary style={{ marginBottom: 10 }} floated="right">
            Create new Request
          </Button>
        </a>
      </Link>
      <Table celled>
        <Header>
          <Row>
            <HeaderCell>Id</HeaderCell>
            <HeaderCell>Recepient</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {props.requests.map((r, i) => (
            <RequestRow
              key={i}
              index={i}
              request={r}
              approvers={props.totalApprovers}
              addr={props.camp_addr}
            />
          ))}
        </Body>
      </Table>
      <h5>Number of Requests:- {props.total}</h5>
    </Layout>
  );
};

RequestHome.getInitialProps = async (context) => {
  const campaignContract = campaign(context.query["camp_addr"]);
  const count = await campaignContract.methods.getRequestsCount().call();
  let requests = [];
  for (let i = 0; i < count; i++) {
    requests.push(
      new Promise(async (resolve, reject) => {
        try {
          let res = await campaignContract.methods.requests(i).call();
          resolve(res);
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  let resp = await Promise.all(requests);
  let total = await campaignContract.methods.approversCount().call();
  console.log(total);
  return {
    requests: resp,
    camp_addr: context.query["camp_addr"],
    totalApprovers: total,
    contract: campaignContract,
    total: count,
  };
};

export default RequestHome;
