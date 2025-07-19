// Updated ABI from FeedbackDapp.json
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "feedback",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "FeedbackAdded",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_feedback",
            "type": "string"
          }
        ],
        "name": "addFeedback",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getFeedbacks",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "feedback",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "internalType": "struct FeedbackDapp.Feedback[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
];

let provider;
let signer;
let contract;

// Connect Wallet
const connectButton = document.getElementById("connectWallet");

connectButton.addEventListener("click", async () => {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Wallet connected:", await signer.getAddress());
        connectButton.textContent = "✅ Connected";
        connectButton.disabled = true;
        connectButton.classList.add("connected");

        loadFeedbacks();  // Load feedbacks after connecting
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Failed to connect wallet. Check console for details.");
    }
});

// Submit Feedback
document.getElementById("submitFeedback").addEventListener("click", async () => {
    const feedback = document.getElementById("feedbackInput").value.trim();
    if (!feedback) {
        alert("Please enter valid feedback.");
        return;
    }

    try {
        const tx = await contract.addFeedback(feedback);
        console.log("Submitting feedback, waiting for confirmation...");
        await tx.wait();

        alert("✅ Feedback submitted successfully!");
        document.getElementById("feedbackInput").value = ""; // Clear input
        loadFeedbacks();  // Refresh feedback list
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("❌ Failed to submit feedback. Check console for details.");
    }
});

// Load Feedbacks
async function loadFeedbacks() {
    if (!contract) {
        console.error("Contract not initialized.");
        return;
    }

    const feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = "Loading feedbacks...";

    try {
        const feedbacks = await contract.getFeedbacks();
        feedbackList.innerHTML = ""; // Clear previous feedbacks

        if (feedbacks.length === 0) {
            feedbackList.innerHTML = "<li>No feedbacks available yet.</li>";
            return;
        }

        feedbacks.forEach((fb) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${fb.user}</strong>: ${fb.feedback}`;
            feedbackList.appendChild(li);
        });

    } catch (error) {
        console.error("Error loading feedbacks:", error);
        feedbackList.innerHTML = "<li>❌ Failed to load feedbacks.</li>";
    }
}

// Load feedbacks on page load
window.onload = loadFeedbacks;
