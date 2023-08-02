pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] campaigns;

    function CampaignFactory() public {}

    function createCampaign(uint minimum) public {
        address temp = new Campaign(minimum,msg.sender);
        campaigns.push(temp);
    }

    function getCampaigns() public view returns (address[]){
        return campaigns;
    }
}

contract Campaign {
    struct Request {
      address recepient;
      uint value;
      string description;
      bool complete;
      mapping(address => bool) approvals; //people who have approved
      uint approvalCount; //count of people who have voted a yes
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers; //people who are allowed to approve
    uint public approversCount;


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign (uint minimum , address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute () public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;

    }

    function createRequest(address recepient, uint value, string description) public restricted {
         Request memory newRequest = Request({
             recepient:recepient,
             value:value,
             description:description,
             complete:false,
             approvalCount:0
         }); //no need to initialize a reference type

         requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]); //The approver has contributed
        Request storage target = requests[index]; //passing reference
        require(!target.approvals[msg.sender]); //The approver has not voted before
        target.approvals[msg.sender] = true;
        target.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage target = requests[index];
        require(!target.complete); //not already completed
        require(target.approvalCount > approversCount/2);
        target.recepient.transfer(target.value);
        target.complete = true;
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
    
    function getSummary() public view returns (uint,uint,uint,uint,address) { 

        return (
            this.balance,
            minimumContribution,
            requests.length,
            approversCount,
            manager
        );
    }
}