Moralis.initialize("yAbW3JxCBauoRI9Au5aie4dhV6uQ0eu6jFmAjCb3"); // Application id from moralis.io
Moralis.serverURL = "https://ivsd7jh7u65y.moralishost.com:2053/server"; //Server url from moralis.io
const CONTRACT_ADDRESS = "0x279B78674A06D2b3565B31190C28A866bA7673c8";
let currentUser;
let wallet;  
let web3;
let ownedId;

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

    web3 = await Moralis.Web3.enable(); 
    
    if(!currentUser){
        window.location.pathname = "./WalletMonsterNFTManager/index.html"; 
    }

   
    const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"};
    let NFTs = await Moralis.Web3API.token.getNFTOwners(options);

    for(let i = 1; i < NFTs.result.length; i++){
        
        if(NFTs.result[i].owner_of == wallet.attributes.accounts[0]){
            ownedNFTs.push(NFTs.result[i]);
            
        }   
    }
   
    let userData = await getUserData();
    getCollection(ownedNFTs, userData);
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

async function renderInventory(ownedNFTs, resData, nftOwners, nftIds, userData){

    const parent = document.getElementById("appManager");
    
    web3 = await Moralis.Web3.enable();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    for(let i = 1; 1 <= ownedNFTs.length; i++ ){
        const nft = ownedNFTs[i];
        const resdata = resData[i];
        const nftowners = nftOwners[i];
        const nftids = nftIds[i];
        
        let trackerCount = userData[nftids];
        let details = await contract.methods.getTokenDetails(nftids).call({from: accounts[0]});

        let died;
        let now = new Date();
        let maxTime = details.endurance;

        let unixTimeNow = Math.floor(now.getTime() / 1000); //convert to seconds. solidity works in seconds. JS works in ms

         //calc where we are between max time and death, rest time and rested
         let timeLeft = ( parseInt(details.lastMeal) + parseInt(details.endurance) ) - unixTimeNow; //Health bar
         let restLeft = ( parseInt(details.lastTrained) + 900 ) - unixTimeNow; //rest bar

          //calc the percentage left now
        let lifePercentageLeft = timeLeft / maxTime; //life
        let restPercentageLeft = restLeft / maxTime; //rest
        //test show where we are
        console.log("life percentage left: " + lifePercentageLeft);
        console.log("rest percentage left: " +  restPercentageLeft);

        let lifePercentageString = (lifePercentageLeft * 100)  + "%";
        let restPerecntageString = (restPercentageLeft * 100) + "%";

        let canTrain = new Date( (parseInt(details.lastTrained) + 900) * 1000);
        let deathTime = new Date( (parseInt(details.lastMeal) + parseInt(details.endurance)) * 1000);

         //vital function calc logic
         if(now > deathTime){
            deathTime = "<b>DEAD</b>";
            canTrain = "<div style='display:inline-block'><b>DEAD</b></div>";
            died =" IMMUTABLE DEATH"; 
        }

        if(now > canTrain){
            canTrain ="<b>Enjimon fully rested</b>"
        }else
        {
            canTrain = canTrain;
        }

           //run everytime the alotted time hits.
            let interval = setInterval(() => {
            let now = new Date(); 
            let maxTime = details.endurance; 
            let unixTimeNow = Math.floor(now.getTime() / 1000); 
            let timeLeft = ( parseInt(details.lastMeal) + parseInt(details.endurance) ) - unixTimeNow; 
            let lifePercentageLeft = timeLeft / maxTime; 
            let lifePercentageString = (lifePercentageLeft * 100)  + "%";
            $(`#enjimon_${nftids} .life-bar`).css("width", lifePercentageString );

            //if enjimon is dead stop function from executing
            if(lifePercentageLeft < 0){
               
               clearInterval(interval);
               $(`#enjimon_${nftids} .enjimon_img`).css("opacity", 0.2 ); 
               $(`#enjimon_${nftids} .trainBtn`).css("display", "none" );
               $(`#enjimon_${nftids} .feedBtn`).css("display", "none" );
               $(`#enjimon_${nftids} .battleBtn`).css("display", "none" );
               $(`#enjimon_${nftids} .progress`).css("display", "none"); 
               $(`#enjimon_${nftids} .enjimon_died`).css("display", "block" );

               $(document).ready(function(){    
                //Check if the current URL contains '#'
                if(document.URL.indexOf("#")==-1){
                    // Set the URL to whatever it was plus "#".
                    url = document.URL+"#";
                    location = "#";
            
                    //Reload the page
                    location.forcedReload(true);
                }
            });
            }

        }, 5000);

        if(trackerCount === undefined){
            trackerCount = 0;
        }

        let htmlString = ` 
            <div class="card" id="enjimon_${nftids}" style=""> 
                <video controls autoplay loop poster="${nft.image}" class="card-img-top enjimon_img" alt="..."> 
                <source src="${nft.image}" type="video/mp4">
               
                
                </video>
                
                <div class="card-body">
                    <h5 class="card-title">${details.enjimonName} <span><small>LVL: ${details.level}</small></span></h5>
                    
                    <p class="card-text">HP: ${details.healthPoints}</p>
                    <p class="card-text">ATK: ${details.attack}</p>
                    <p class="card-text">DEF: ${details.defense}</p>
                    <p class="card-text">Endurance: ${details.endurance}</p>

                    <p class="card-text">Starvation Time:  <span class="enjimon_starvation">${deathTime}</span></p>
                    <p class="card-text">Fully Rested: <span class="enjimon_training">${canTrain}</span></p>
                    <div class="enjimon_died" style="display: none"><b>Death:</b><span>${died}</span></div>
                    <div class="progress" style="margin-bottom: 10px;">
                        <div class="progress-bar life-bar" style="width: ${lifePercentageString};"></div>
                    </div>

                    <p class="card-text">#Existence: ${resdata}</p>
                    <p class="card-text">Your Balance: ${trackerCount}</p>
                    <p class="card-text">${nft.description} <br><b>ID: ${nftids}</b></p>
                    <p class="card-text">Owner: ${nftowners}</p>
                    <a  onclick="feed()" class="btn btn-primary feedBtn">Feed</a>
                    <a  onclick="train()" class="btn btn-primary trainBtn">Train</a>
                    <a  onclick="battle()" class="btn btn-primary battleBtn">Battle</a>
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


init();