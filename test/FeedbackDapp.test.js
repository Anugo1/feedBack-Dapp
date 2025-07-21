const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Feedback contract", function () {
  let Feedback, feedback, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    Feedback = await ethers.getContractFactory("Feedback");
    feedback = await Feedback.deploy();
  });

  it("should allow a user to submit feedback", async function () {
    const productId = 1;
    const rating = 5;
    const reviewHash = ethers.encodeBytes32String("review1");

    // Get the transaction
    const tx = await feedback.connect(user1).submitFeedback(productId, rating, reviewHash);
    const receipt = await tx.wait();
    
    // Get the timestamp from the block
    const block = await ethers.provider.getBlock(receipt.blockNumber);
    const timestamp = block.timestamp;

    // Check the event was emitted
    await expect(tx)
      .to.emit(feedback, "FeedbackSubmitted")
      .withArgs(productId, user1.address, rating, reviewHash, timestamp);

    // Check the stored data
    const reviews = await feedback.getFeedbackForProduct(productId);
    expect(reviews.length).to.equal(1);
    expect(reviews[0].user).to.equal(user1.address);
    expect(reviews[0].rating).to.equal(rating);
    expect(reviews[0].reviewHash).to.equal(reviewHash);
  });

  it("should not allow duplicate feedback from the same user for the same product", async function () {
    const productId = 2;
    const rating = 4;
    const reviewHash = ethers.encodeBytes32String("review2");

    await feedback.connect(user1).submitFeedback(productId, rating, reviewHash);
    await expect(
      feedback.connect(user1).submitFeedback(productId, rating, reviewHash)
    ).to.be.revertedWith("Already submitted");
  });

  it("should not allow rating outside 1-5", async function () {
    const productId = 3;
    const badRating = 6;
    const reviewHash = ethers.encodeBytes32String("review3");
    await expect(
      feedback.connect(user1).submitFeedback(productId, badRating, reviewHash)
    ).to.be.revertedWith("Rating must be between 1 and 5");
  });

  it("should not allow empty review hash", async function () {
    const productId = 4;
    const rating = 3;
    const emptyHash = ethers.ZeroHash; // Use ZeroHash instead of HashZero
    await expect(
      feedback.connect(user1).submitFeedback(productId, rating, emptyHash)
    ).to.be.revertedWith("Empty review hash");
  });

  it("should return correct review count", async function () {
    const productId = 5;
    const rating = 2;
    const reviewHash1 = ethers.encodeBytes32String("reviewA");
    const reviewHash2 = ethers.encodeBytes32String("reviewB");
    await feedback.connect(user1).submitFeedback(productId, rating, reviewHash1);
    await feedback.connect(user2).submitFeedback(productId, rating, reviewHash2);
    const count = await feedback.reviewCount(productId);
    expect(count).to.equal(2);
  });

  it("should allow different users to submit feedback for the same product", async function () {
    const productId = 6;
    const rating1 = 5;
    const rating2 = 3;
    const reviewHash1 = ethers.encodeBytes32String("user1review");
    const reviewHash2 = ethers.encodeBytes32String("user2review");

    await feedback.connect(user1).submitFeedback(productId, rating1, reviewHash1);
    await feedback.connect(user2).submitFeedback(productId, rating2, reviewHash2);

    const reviews = await feedback.getFeedbackForProduct(productId);
    expect(reviews.length).to.equal(2);
    expect(reviews[0].user).to.equal(user1.address);
    expect(reviews[1].user).to.equal(user2.address);
  });

  it("should allow same user to submit feedback for different products", async function () {
    const productId1 = 7;
    const productId2 = 8;
    const rating = 4;
    const reviewHash1 = ethers.encodeBytes32String("product1review");
    const reviewHash2 = ethers.encodeBytes32String("product2review");

    await feedback.connect(user1).submitFeedback(productId1, rating, reviewHash1);
    await feedback.connect(user1).submitFeedback(productId2, rating, reviewHash2);

    const reviews1 = await feedback.getFeedbackForProduct(productId1);
    const reviews2 = await feedback.getFeedbackForProduct(productId2);
    
    expect(reviews1.length).to.equal(1);
    expect(reviews2.length).to.equal(1);
    expect(reviews1[0].user).to.equal(user1.address);
    expect(reviews2[0].user).to.equal(user1.address);
  });
});