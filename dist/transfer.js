Moralis.initialize("xXH1IL0ORWvCjl2vMfMmi1EpwhIrXE17mQjYJCRN"); // Application id from moralis.io
Moralis.serverURL = "https://bpsygtsl1obp.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x7b2023861100E5dCb694f16c2c1F46bBf2bC85FB";
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

document.getElementById('submit_transfer').onclick = transfer;

init();