Moralis.initialize("xXH1IL0ORWvCjl2vMfMmi1EpwhIrXE17mQjYJCRN"); // Application id from moralis.io
Moralis.serverURL = "https://bpsygtsl1obp.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0xe63D9D2928B836d1c4723172b4D4144A7A6aCF4c";
let web3; // set empty web3 object will initialzie in init. required to make calls to smart contract
let currentUser;


init = async () =>{
    currentUser = await Moralis.User.current();

    if(!currentUser){
        window.location.pathname = "./WalletMonsterNFTManager/index.html"; 
    }

    web3 = await Moralis.Web3.enable(); //initiaizing web3 library via moralis
    let accounts = await web3.eth.getAccounts();
    

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId"); 
    
    document.getElementById('address_input').value = accounts[0]; //prepopulate address

   
}



mint = async () => {
    
    
    let address = document.getElementById('address_input').value;
    let amount = parseInt(document.getElementById('amount_input').value);
    
    const accounts = await web3.eth.getAccounts(); //gets current metamask user
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    
    contract.methods.mint(address, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("Mint Completed");
        console.log(receipt);
    });
}

mintMonster = async () => {

  
    let Name = document.getElementById('name_input').value;
    let enjimonType = document.getElementById('enjimonType_input').value;

    let Health = parseInt(document.getElementById('health_input').value);
    let Defense = parseInt(document.getElementById('defense_input').value);
    let Attack = parseInt(document.getElementById('attack_input').value);
    let Endurance = parseInt(document.getElementById('endur_input').value);
    let Level = parseInt(document.getElementById('level_input').value);

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.mintMonster(Name, Health , Defense, Attack, Endurance, Level, enjimonType ).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("Mint Completed");
        console.log(receipt);
    });
    
}

document.getElementById('submit_mint').onclick = mint;
document.getElementById('submit_mintMonster').onclick = mintMonster;

init();