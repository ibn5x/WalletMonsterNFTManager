Moralis.initialize("xXH1IL0ORWvCjl2vMfMmi1EpwhIrXE17mQjYJCRN"); // Application id from moralis.io
Moralis.serverURL = "https://bpsygtsl1obp.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x19A92f37e090a346cA5D226a5aa381035949dCdA";
let currentUser;
let wallet;
let web3;

getUserData = async () => {
    let accounts = currentUser.get('accounts');
    const  options = {chain: 'rinkeby', address: accounts[0], token_address: CONTRACT_ADDRESS};
    return Moralis.Web3API.account.getNFTsForContract(options).then( (data) => { 
      let result = data.result.reduce( (object, currentElement) =>{
              object[currentElement.token_id] = currentElement.amount;
              return object;
            }, {})

            return result;
    });
}

init = async () => {

    currentUser = await Moralis.User.current();
    wallet = currentUser;
    let ownedNFTs = [];
    //let accounts = await web3.eth.getAccounts();
    
    web3 = await Moralis.Web3.enable(); //initiaizing web3 library via moralis
    
    
    if(!currentUser){
        window.location.pathname = "index.html"; 
    }
    alert("in order to feed, train or battle your enjimon, first input the id of the enjimon you wish to interact with");
    const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"};
    let NFTs = await Moralis.Web3API.token.getNFTOwners(options);

    for(let i = 0; i < NFTs.result.length; i++){
        
        if(NFTs.result[i].owner_of == wallet.attributes.accounts[0]){
            ownedNFTs.push(NFTs.result[i]);
            
        }
        
    }
    console.log(ownedNFTs);
    
    
      
    let userData = await getUserData();
    getCollection(ownedNFTs, userData);
    //console.log(currentOwner);
    //console.log(NFTs.result.length);
}



async function getCollection(ownedNFTs, userData){

    let resultingData = [];
    let resData = [];
    let nftOwners = [];
    let nftIds = [];

    for(let count = 0; count < ownedNFTs.length; count++){
     
        let nftId = ownedNFTs[count].token_id;
        let num = 0;
        
        const options = { address: CONTRACT_ADDRESS, token_id: nftId, chain: "rinkeby" };
        let tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options); 

        let targetData = (tokenIdOwners.result[num].amount);
        let ownerData = (tokenIdOwners.result[num].owner_of);
        
        let info = ownedNFTs[count].metadata;
        let data = info;
        let obj = JSON.parse(data);

        resultingData.push(obj);  
        nftOwners.push(ownerData);
        nftIds.push(tokenIdOwners.result[num].token_id)
        resData.push(targetData);
      
  }
        
    renderInventory(resultingData, resData, nftOwners, nftIds, userData);
           
}

function renderInventory(ownedNFTs, resData, nftOwners, nftIds, userData){

    const parent = document.getElementById("appManager");

    for(let i = 0; 0 < ownedNFTs.length; i++ ){
        const nft = ownedNFTs[i];
        const resdata = resData[i];
        const nftowners = nftOwners[i];
        const nftids = nftIds[i];

        let trackerCount = userData[nftids];
        if(trackerCount === undefined){
            trackerCount = 0;
        }

        let htmlString = ` 
            <div class="card" style=""> 
                <video controls poster="${nft.image}" class="card-img-top" alt="...">
                <source src="${nft.image}" type="video/mp4">
               
                
                </video>
                
                <div class="card-body">
                    <h5 class="card-title">${nft.name}</h5>
                    <p class="card-text">${nft.description}</p>
                    <p class="card-text">amount: ${resdata}</p>
                    <p class="card-text">Owner: ${nftowners}</p>
                    <p class="card-text">Your Balance: ${trackerCount}</p>
                    <a id="feed_btn" onclick="feed()" class="btn btn-primary">Feed</a>
                    <a id="train_btn" onclick="train()" class="btn btn-primary">Train</a>
                    <a id="battle_btn" onclick="battle()" class="btn btn-primary">Battle</a>
                </div>
            </div>
        `;
      
        let col = document.createElement("div");
        col.className = "col col-md-4";
        col.style = "margin-bottom: 30px";
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }

}

feed = async () =>{


    let tokenId = parseInt(document.getElementById('monster_id_input').value);

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    

    contract.methods.feed(tokenId).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("feeding Completed");
        console.log(receipt);
    });

}

train = async () => {

    let tokenId = parseInt(document.getElementById('monster_id_input').value);

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.train(tokenId).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt){
        alert("training Completed");
        console.log(receipt);
    });

}

function battle(){
    alert("implementing battle functionality soon!");
}

function refreshContract(){
    location.reload(); 
}

document.getElementById('btn-smartContract').onclick = refreshContract;
////document.getElementById('feed-btn').onclick = feed();
//document.getElementById('train-btn').onclick = train;
//document.getElementById('battle-btn').onclick = battle;

init();