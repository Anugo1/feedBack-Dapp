// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract FeedbackDapp {
    event FeedbackAdded(uint256 id, string feedback, address indexed user);

    struct Feedback {
        uint256 id;
        string feedback;
        address user;
    }

    Feedback[] public feedbacks;

    constructor() {
        console.log("Feedback Dapp is deployed");
    }

    function addFeedback(string memory _feedback) public {
        require(bytes(_feedback).length > 0, "Feedback cannot be empty");
        uint256 feedbackId = feedbacks.length;
        feedbacks.push(Feedback(feedbackId, _feedback, msg.sender));
        emit FeedbackAdded(feedbackId, _feedback, msg.sender);
    }

    function getFeedBacks() public view returns (Feedback[] memory) {
        Feedback[] memory allFeedbacks = new Feedback[](feedbacks.length);
        for (uint256 i = 0; i < feedbacks.length; i++) {
            allFeedbacks[i] = feedbacks[i];
        }
        return allFeedbacks;
    }

    function getFeedBack(uint256 _id) public view returns (Feedback memory) {
        require(_id < feedbacks.length, "Feedback ID out of range");
        return feedbacks[_id];
    }
}
