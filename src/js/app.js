/* variables */
const BET_AMOUNT = 100000000000000; /* 0.0001 ether, around $6 */
const GAS = 700000;
const bets = [];
let contract;
let lastPosition = 0;
let wheelSpinCounter = 0;
let firstBetAfterSpin = true;
let web3Provider = null;
let lastBlockEvent = 0;
let adminAccount = "0x405BeF5792601DEDa1a73bB922072624dE71E573";

const betTypes = [
  'color', 'column', 'dozen',
  'eighteen', 'modulus', 'number'
];

function showWarning(msg) {
  var p = document.getElementById('warning');
  p.innerHTML = msg;
  p.style.display = 'block';
}


window.addEventListener('load', async function () {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    // Get the user's accounts
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    userAccount = accounts[0];
  } else {
    // Handle the case where the user doesn't have Metamask installed
    // Probably show them a message prompting them to install Metamask
  }

  // Now you can start your app & access web3 freely:
  startApp()

})

function startApp() {

  var Address = "0x2e7c2e20283F438aF61EB145ff2e63531b6DF0D6";
  var contractABI = [
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
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "RandomNumber",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "RandomNumber1",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "addEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "addvalue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "number",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "betType",
          "type": "uint8"
        }
      ],
      "name": "bet",
      "outputs": [],
      "stateMutability": "payable",
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
      "name": "bets",
      "outputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "betType",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "number",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cashOut",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContract",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStatus",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStatus2",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getWin",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getbet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getowner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "spinWheel",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "transferEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];
  contract = new web3.eth.Contract(contractABI, Address);
  updateUI();
}

function showError(msg, err) {
  const p = document.getElementById('errorPanel');
  p.innerText = msg;
  setTimeout(function () {
    p.innerHTML = '&nbsp;';
  }, 4000);
}

function hideBets() {
  var div = document.getElementById('betsList');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function cleanBets() {
  bets.length = 0;
  hideBets();
}

function placeBet() {
  let area = this.id;
  let bet = {};
  if (/^c\_\d/.test(area)) bet = {
    type: 0,
    value: parseInt(area.substr(2))
  };
  if (/^p\_\d/.test(area)) bet = {
    type: 1,
    value: parseInt(area.substr(2))
  };
  if (/^d\_\d/.test(area)) bet = {
    type: 2,
    value: parseInt(area.substr(2))
  };
  if (/^e\_\d/.test(area)) bet = {
    type: 3,
    value: parseInt(area.substr(2))
  };
  if (/^m\_\d/.test(area)) bet = {
    type: 4,
    value: parseInt(area.substr(2))
  };
  if (/^n\d\d/.test(area)) bet = {
    type: 5,
    value: parseInt(area.substr(1))
  };
  console.log(bet.type, bet.value);
  if (bet.hasOwnProperty('type') && bet.hasOwnProperty('value')) {
    
    const transactionParams = {
      from: '0x613161d2Eb018791B66Ef4917ea1cFF593ca435a', // Your sender address
      to: '0x2e7c2e20283F438aF61EB145ff2e63531b6DF0D6',
      value: BET_AMOUNT,
      gas: GAS // Adjust gas limit as needed
    };

    contract.methods.bet(bet.value, bet.type)
      .send(transactionParams, (error, transactionHash) => {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Transaction Hash:', transactionHash);
        }
      })
      .on("receipt", function (receipt) {
        pushBet(bet);
      })
      .on("error", function (error) {
        // Do something to alert the user their transaction has failed
        console.log("Error");
      });
  }
}

function pushBet(hash) {
  if (firstBetAfterSpin) cleanBets();
  firstBetAfterSpin = false;
  bets.push(hash);
  printBet(hash);
}

function printBet(hash) {
  const labelForNum = {
    color: {
      0: 'black',
      1: 'red'
    },
    column: {
      0: 'left',
      1: 'middle',
      2: 'right'
    },
    dozen: {
      0: '1st',
      1: '2nd',
      2: '3rd'
    },
    eighteen: {
      0: '1-18',
      1: '19-36'
    },
    modulus: {
      0: 'even',
      1: 'odd'
    }
  }
  const type = betTypes[hash.type];
  const value = type === 'number' ? hash.value : labelForNum[type][hash.value];
  const div = document.getElementById('betsList');
  const p = document.createElement('p');
  p.innerText = type + ' ' + value + ' ';
  if (hash.hasOwnProperty('status')) {
    p.innerText += (hash.status ? 'WIN' : 'LOST');
  }
  div.appendChild(p);
}

function showBetsStatus(num) {
  hideBets();
  bets.map(function (bet) {
    if (num === 0) {
      bet.status = (bet.type === 5 && bet.value === 0); // bet on 0
    } else {
      if (bet.type === 5) { // bet on number
        bet.status = (bet.value === num);
      }
      if (bet.type === 4) { // bet on modulus
        if (bet.value === 0) bet.status = (num % 2 === 0);
        if (bet.value === 1) bet.status = (num % 2 === 1);
      }
      if (bet.type === 3) { // bet on eighteen
        if (bet.value === 0) bet.status = (num <= 18);
        if (bet.value === 1) bet.status = (num >= 19);
      }
      if (bet.type === 2) { // bet on dozen
        if (bet.value === 0) bet.status = (num <= 12);
        if (bet.value === 1) bet.status = (num >= 13 && num <= 24);
        if (bet.value === 2) bet.status = (num >= 25);
      }
      if (bet.type === 1) { // bet on column
        if (bet.value === 0) bet.status = (num % 3 === 1);
        if (bet.value === 1) bet.status = (num % 3 === 2);
        if (bet.value === 2) bet.status = (num % 3 === 0);
      }
      if (bet.type === 0) { // bet on color
        if (num <= 10 || (num >= 20 && num <= 28)) {
          if (bet.value === 0) bet.status = (num % 2 === 0)
          if (bet.value === 1) bet.status = (num % 2 === 1)
        } else {
          if (bet.value === 0) bet.status = (num % 2 === 1)
          if (bet.value === 1) bet.status = (num % 2 === 0)
        }
      }
    }
    printBet(bet);
  })
}

function num(){
  contract.methods.getNumber().call((err, res) => {
    const oneRandomNumber = res;
      /* spin counter + 1 */
      wheelSpinCounter += 1;
      /* get wheel element */
      var wheel = document.getElementById("wheel");
      /* reset wheel */
      wheel.style.transform = "rotate(" + lastPosition + "deg)";
      /* numbers in the wheel, ordered clockwise */
      var numbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
        13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
        20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
      ];
      /* calculate how much do we need to rotate to have the random number chosen */
      var numberDegree = numbers.indexOf(oneRandomNumber) * 360 / numbers.length;
      /* add some rounds before to look like it's spinning */
      var numRoundsBefore = 3 * wheelSpinCounter;
      /* calculate total degrees we need to rotate */
      var totalDegrees = (numRoundsBefore * 360) + numberDegree;
      /* rotate the wheel */
      document.getElementById("wheel").style.transform = "rotate(-" + totalDegrees + "deg)";
      /* save position to be able to reset the wheel next time */
      lastPosition = numberDegree;
      /* show status on bets after wheel stops */
      setTimeout(function () {
        showBetsStatus(oneRandomNumber);
      }, 2000);
  });
}
function spinWheel() {
  const transactionParams = {
    from: '0x613161d2Eb018791B66Ef4917ea1cFF593ca435a', // Your sender address
    to: '0x2e7c2e20283F438aF61EB145ff2e63531b6DF0D6',
    value: 0,
    gas: GAS // Adjust gas limit as needed
  };

  contract.methods.spinWheel()
      .send(transactionParams, (error, transactionHash) => {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Transaction Hash for spinWheel:', transactionHash);
        }
      })
      .on("receipt", function (receipt) {
        
        firstBetAfterSpin = true;
        console.log(receipt);
        return num();
    
      })
      .on("error", function (error) {
        // Do something to alert the user their transaction has failed
        console.log("NOOO");
      });
 
}

function cashOut() {
  const transactionParams = {
    from: '0x613161d2Eb018791B66Ef4917ea1cFF593ca435a', // Your sender address
    to: '0x2e7c2e20283F438aF61EB145ff2e63531b6DF0D6',
    value: 0,
    gas: GAS // Adjust gas limit as needed
  };

  contract.methods.cashOut()
      .send(transactionParams, (error, transactionHash) => {
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Transaction Hash for cashOut:', transactionHash);
        }
      })
      .on("receipt", function (receipt) {
        
      })
      .on("error", function (error) {
        // Do something to alert the user their transaction has failed
        return void showError('something went wrong with cashOut', err);
       
      });
  
}

function toEther(bigNum) {
  return (bigNum / 1000000000000000000).toFixed(2);
}

function updateHTML(value, elId) {
  const span = document.getElementById(elId);
  span.innerText = value;
}

function getWin(){
  contract.methods.getWin().call((err,res) => {
    updateHTML(res, 'winnings');
  });
}
/* call smart contract to get status and update UI */
function getStatus() {
  contract.methods.getStatus().call((err, res) => {
    
    updateHTML(res[0], 'betsCount'); // bets count
    res[1] = toEther(res[1]); // bets value
    updateHTML(res[1], 'betsValue');
    const now = Math.round(new Date() / 1000); // time until next spin
    res[2] = res[2] < now ? 0 : (res[2] - now);
    updateHTML(res[2], 'timeUntilNextSpin');
    res[3] = toEther(res[3]); // roulette balance
    updateHTML(res[3], 'balance');
    // res[4] = toEther(res[4]); // winnings
    // updateHTML(res[4], 'winnings');
  })
  
  web3.eth.getBalance(userAccount)
    .then(balance => {
      updateHTML(balance, 'yourBalance');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
}

/* every second query smart contract for status */
function updateUI() {
  setInterval(function () {
    getStatus();
    getWin();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
  /* adds click event to roulette table */
  var areas = document.getElementsByTagName('area');
  for (i = 0; i < areas.length; i++) {
    areas[i].onclick = placeBet;
  };
})