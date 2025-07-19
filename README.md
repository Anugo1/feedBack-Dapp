# Feedback DApp

Welcome to the **Cyberpunk Feedback DApp**! This decentralized application allows users to submit feedback securely on the blockchain. The DApp is live on the [Sepolia Testnet](https://sepolia.etherscan.io/) and hosted at:

🔗 **Live Link:** [https://feed-back-dapp.vercel.app/](https://feed-back-dapp.vercel.app/)

---

## 📄 Features
- **Connect Wallet:** Interact with the DApp using MetaMask.
- **Submit Feedback:** Share your feedback, stored immutably on the blockchain.
- **View Feedback:** See all submitted feedback from connected users.

---

## ⚙️ Requirements
- **MetaMask Wallet** (installed and connected to the Sepolia testnet)
- **Ethereum (Sepolia) Testnet ETH** for transactions

---

## 🛠️ How to Run the DApp Locally

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd feedback-dapp
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Deploy Smart Contract**
Ensure you have Hardhat installed:
```bash
npm install --save-dev hardhat
```

Run the deployment script:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

> 🔄 Update the deployed contract address in `app.js` if it changes.

### 4. **Start the Frontend**
If you're using Vercel or Netlify, just push your project. For local testing:
```bash
npx vercel dev
```

---

## 🔗 Using the DApp
1. **Visit the DApp:** Go to [https://feed-back-dapp.vercel.app/](https://feed-back-dapp.vercel.app/)
2. **Connect Wallet:** Click the **"🔗 Connect Wallet"** button.
3. **Submit Feedback:** Enter your feedback and click **"🚀 Submit"**.
4. **View Feedback:** Your feedback will display in the list below after confirmation.

> 💡 **Note:** You must be connected to the Sepolia Testnet in MetaMask.

---

## 🛡️ Troubleshooting
- **MetaMask Not Detected?** Ensure MetaMask is installed and active.
- **Transaction Fails?** Check if you have enough Sepolia ETH for gas fees.
- **Feedback Not Loading?** Ensure the contract address in `app.js` matches the deployed address.

---

## ✨ Tech Stack
- **Solidity:** For writing the smart contract
- **Hardhat:** For testing and deploying the contract
- **Ethers.js:** For blockchain interaction in the frontend
- **Vercel:** For frontend hosting

---
