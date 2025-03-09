// Replace with your deployed contract address
const contractAddress = "0x30E1cB9918556C7067Ce9B644E9825FC55cA2c2F";
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
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
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "feedbacks",
        "outputs": [
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
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getFeedBack",
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
            "internalType": "struct FeedbackDapp.Feedback",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      
];

let provider;
let signer;
let contract;

// Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("Wallet connected");

            alert("Wallet connected successfully!");

            // Load feedbacks only after the wallet is connected
            loadFeedbacks();
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Failed to connect wallet. Check console for details.");
        }
    } else {
        alert("Please install MetaMask!");
    }
});


// Submit Feedback
document.getElementById("submitFeedback").addEventListener("click", async () => {
    const feedback = document.getElementById("feedbackInput").value.trim();
    if (feedback) {
        try {
            const tx = await contract.addFeedback(feedback);
            await tx.wait();
            alert("Feedback submitted successfully!");
            loadFeedbacks();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Check console for details.");
        }
    } else {
        alert("Please enter valid feedback.");
    }
});

// Load Feedbacks
async function loadFeedbacks() {
    if (!contract) {
        console.error("Contract not initialized.");
        return;
    }

    try {
        const feedbacks = await contract.getFeedBacks();
        const feedbackList = document.getElementById("feedbackList");
        feedbackList.innerHTML = "";
        feedbacks.forEach((fb) => {
            const li = document.createElement("li");
            li.textContent = `${fb.user}: ${fb.feedback}`;
            feedbackList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading feedbacks:", error);
        alert("Failed to load feedbacks. Check console for details.");
    }
}


// Load feedbacks on page load
window.onload = loadFeedbacks;
