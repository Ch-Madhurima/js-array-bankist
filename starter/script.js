'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let timer;
const displayMovements = function (acc, sort = true) {
  containerMovements.innerHTML = ' ';

  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  //console.log('these are the moments' + movements);

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    console.log(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = `${date.getFullYear()}`.padStart(2, 0);
    const displayDate = `${day}/${month}/${year}`;
    console.log(`this is displaydate ${displayDate}`);
    const html = `
     <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}$</div>
  </div>
  `;
    // console.log(html);
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1);

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    // console.log(acc + mov);
    labelBalance.textContent = `${(acc + mov).toFixed(2)} $`;
    labelDate.textContent = new Date().toISOString();
    // acc.balance = acc + mov;
    //console('baby idhi nee console balance   ' + acc.balance);
    return acc + mov;
  }, 0);
};
//displayBalance(account1);

const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)} $`;
  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${outgoing.toFixed(2)} $`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int > 1;
    })
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

//displaySummary(account1);

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    //console.log('this is the username  ' + acc.userName);
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};

const startLogoutTimer = function () {
  //set time to five min
  
  //call the timer for every sec
  const tick =function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //in each call print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;
   
    //when 0 sec stop the timer and lodout user
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent()='lets get started';
      containerApp.style.opacity = 0;

      
    }
    time--;

  };
  let time=120;
  tick();
   timer= setInterval(tick,1000);
  return timer;
};
let currentAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);
  // console.log('this is the current acc    ' + currentAcc.owner);

  if (currentAcc.pin == inputLoginPin.value) {
    labelWelcome.textContent = `welcome  back ${
      currentAcc.owner.split(' ')[0]
    }`;
    // console.log('welcome msg');
    containerApp.style.opacity = 100;

    //clearing input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    clearInterval(timer);
    timer =startLogoutTimer();

    // update UI
    updateUI(currentAcc);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  console.log('its the amount we r taking loan' + amount);
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date());
    console.log(new Date());
    inputLoanAmount.value = '';
    clearInterval(timer);
    timer =startLogoutTimer();
   
    
    updateUI(currentAcc);
    
  }
  
 
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferToAccName = inputTransferTo.value;
  console.log('the acc username is  ' + transferToAccName);
  const amountToTrans = Number(inputTransferAmount.value);
  console.log('the amount is  ' + amountToTrans);

  const transferToAcc = accounts.find(
    acc => acc.userName === transferToAccName
  );

  if (
    amountToTrans > 0 &&
    transferToAcc &&
    currentAcc.balance >= amountToTrans &&
    transferToAcc.userName !== currentAcc.userName
  ) {
    console.log('to the acc is before ' + transferToAcc.userName);
    transferToAcc.movements.push(amountToTrans);
    transferToAcc.movementsDates.push(new Date());
    currentAcc.movements.push(-amountToTrans);
    currentAcc.movementsDates.push(new Date());
    inputTransferAmount.value = inputTransferTo.value = "";
    updateUI(currentAcc);
    clearInterval(timer);
    timer =startLogoutTimer();
  } else {
    console.log('to the acc is after ' + transferToAcc.userName);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const delUserName = inputCloseUsername.value;
  const delPin = Number(inputClosePin.value);
  const delAccIndex = accounts.findIndex(
    acc => acc.userName === delUserName && acc.pin === delPin
  );
  console.log('index is' + delAccIndex);
  accounts.splice(delAccIndex, 1);
  containerApp.style.opacity = 0;
});
