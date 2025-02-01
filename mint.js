const web3 = require('web3');
const fs = require('fs');

const MultiSkinsAddress = process.env.MULTI_SKINS_ADDRESS

const contractABI = fs.readFile('MultiSkinsAbi.json', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});

async function loadContract() {
    const contract = new web3.eth.contract(contractABI, MultiSkinsAddress);
    return { web3, contract };
}

async function CallMint(skinType) {
    const { web3, contract } = await loadContract();

    const sender = localStorage.getItem("wallet_address");

    try {
        const tx = await contract.methods.mint(skinType).send({
            from: sender,
            // gas: 200000 // Set a gas limit
        });

        console.log("Transaction successful!", tx.transactionHash);
    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

module.exports = { CallMint };