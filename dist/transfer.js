Moralis.initialize("yAbW3JxCBauoRI9Au5aie4dhV6uQ0eu6jFmAjCb3"); // Application id from moralis.io
Moralis.serverURL = "https://ivsd7jh7u65y.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x3FfcfE1F0981A520297b2C236a51c9f4355B13cF";
let currentUser;
let web3; 

init = async () =>{
    currentUser = await Moralis.User.current();

    if(!currentUser){
        window.location.pathname = "./WalletMonsterNFTManager/index.html"; 
    }
    
    web3 = await Moralis.Web3.enable();
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId"); 
   
    document.getElementById('token_id_input').value = nftId; //prepopulate id
    
}

transfer = async () => {
    
    let tokenId = parseInt(document.getElementById('token_id_input').value);
    let address = document.getElementById('address_input').value;
    let amount = parseInt(document.getElementById('amount_input').value);
    
    // sending 15 tokens with token id = 1
    const options = {type: "erc1155",  
    receiver: address,
    contract_address: CONTRACT_ADDRESS,
    token_id: tokenId,
    amount: amount}
    
    let result = await Moralis.transfer(options)
    console.log(result);
}

transferToken = async () => {
    let enjimonToken = 0;
    let amountOfTokens = parseInt(document.getElementById('tokenAmount_input').value);
    let userAddress = document.getElementById('userAddress_input').value;

    const accounts = await web3.eth.getAccounts(); //gets current metamask user
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.safeTransferFrom(accounts[0], userAddress, enjimonToken, amountOfTokens,accounts[0]).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("transfer Completed");
        console.log(receipt);
    });
}

document.getElementById('submit_transfer').onclick = transfer;
document.getElementById('submit_tokenTransfer').onclick = transferToken;


init();