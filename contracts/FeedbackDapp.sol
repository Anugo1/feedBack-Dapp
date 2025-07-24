// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Feedback {
    // ─────────────── Events ───────────────
    event FeedbackSubmitted(
        uint indexed productId,
        address indexed user,
        uint8 rating,
        bytes32 reviewHash,
        uint timestamp
    );

    // ─────────────── Data ───────────────
    struct Review {
        address user;
        uint8  rating;       // 1‑5
        bytes32 reviewHash;  // IPFS CIDv0 multihash or SHA‑256 digest
        uint   timestamp;    // block.timestamp
    }

    mapping(uint => Review[]) private productReviews;        // productId → reviews
    mapping(uint => mapping(address => bool)) private voted; // optional: prevent duplicates

    // ─────────────── Write ───────────────
    function submitFeedback(
        uint productId,
        uint8 rating,
        bytes32 reviewHash
    ) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");   
        require(reviewHash != bytes32(0),     "Empty review hash");
        require(!voted[productId][msg.sender],"Already submitted");

        productReviews[productId].push(
            Review(msg.sender, rating, reviewHash, block.timestamp)
        );
        voted[productId][msg.sender] = true;

        emit FeedbackSubmitted(
            productId,
            msg.sender,
            rating,
            reviewHash,
            block.timestamp
        );
    }

    

    // ─────────────── Read ───────────────
    function getFeedbackForProduct(
        uint productId
    ) external view returns (Review[] memory) {
        return productReviews[productId];
    }

    function reviewCount(uint productId) external view returns (uint) {
        return productReviews[productId].length;
    }
}
