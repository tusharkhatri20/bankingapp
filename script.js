const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    movementsDates: [
        '2021-05-12T10:51:36.790Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-09T14:11:59.604Z',
        '2021-05-10T10:51:36.790Z',
        '2021-05-11T10:51:36.790Z',
        '2021-05-12T10:51:36.790Z',
    ],
    currency: 'USD',
    locale: 'pt-PT',
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
    currency: 'EUR',
    locale: 'en-US',
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// const date = new Date()
// console.log(date)
// const year = `${date.getFullYear()}`.padStart(2, 0);
// const month = `${date.getMonth() + 1}`.padStart(2, 0)
// const day = `${date.getDate()}`.padStart(2, 0)
// const hour = `${date.getHours()}`.padStart(2, 0)
// const min = `${date.getMinutes()}`.padStart(2, 0)
// const today = `${day}/${month}/${year},${hour}:${min}`


const formatDate = function (date, locale) {
    const calcDayPassed = function (date1, date2) {
        return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
    }

    const dayPassed = calcDayPassed(new Date(), date)

    const d = new Date();
    if (dayPassed == 1) return `Today`;
    if (dayPassed == 2) return `Yesterday`
    if (dayPassed <= 3) return `${dayPassed} days ago`
    // else {
    //     const year = `${date.getFullYear()}`.padStart(2, 0);
    //     const month = `${date.getMonth() + 1}`.padStart(2, 0)
    //     const day = `${date.getDate()}`.padStart(2, 0)
    // }
    return new Intl.DateTimeFormat(locale).format(d);

}

const formatCur=function(value,locale,currency){
    return new Intl.NumberFormat(locale,
        {
            style: 'currency',
            currency:currency,
        }).format(value)
}

const displayMovements = function (acc, sort = false) {

    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';


        const dates = new Date(acc.movementsDates[i])
        const displayDate = formatDate(dates, acc.locale)

        const formattedMov = formatCur(mov,acc.locale,acc.currency)

        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
            </div>
            `;
        // console.log(movements)
        containerMovements.insertAdjacentHTML('afterbegin', html)

    })
}
displayMovements(account1)


const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsernames(accounts)

const updateUI = function (acc) {
    displayMovements(acc)
    calcDisplayBalance(acc)
    calcDisplaySummary(acc)
}



const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) =>
        acc + mov, 0);
        const formattedMov = formatCur(acc.balance,acc.locale,acc.currency)

       
    labelBalance.textContent = `${formattedMov}`;
}

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
        const formattedMov = formatCur(incomes,acc.locale,acc.currency)

    labelSumIn.textContent = `${formattedMov}`;

    const withdrawl = acc.movements
        .filter(mov => mov < 0)
        .reduce((arr, mov) => arr + mov, 0);
        const formattedMo = formatCur(Math.abs(withdrawl),acc.locale,acc.currency)

    labelSumOut.textContent = `${formattedMo}`

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(mov => mov * acc.interestRate / 100)
        .filter((mov, i, arr) => {
            return mov >= 1
        })
        .reduce((acc, curr) => acc + curr, 0);
        const formattedM = formatCur(interest,acc.locale,acc.currency)

    labelSumInterest.textContent = `${formattedM}`
}

let currentAccount;


btnLogin.addEventListener('click', function (e) {
    // console.log('LOGIN')
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    // console.log(currentAccount)

    if (currentAccount?.pin == Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome Back ,${currentAccount.owner.split(' ')[0]}!!`
        containerApp.style.opacity = 100

        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            // weekday: 'long'

        };
        // const locale = navigator.language;
        // console.log(locale)

        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
        inputLoginPin.value = inputLoginUsername.value = '';
        inputLoginPin.blur()
        updateUI(currentAccount);

    }

})

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
    inputTransferAmount.value = inputTransferTo.value = '';
    if (amount > 0 && recieverAcc && currentAccount.balance >= amount
        && recieverAcc?.username !== currentAccount.username)
        console.log(`trnasfer valid`)
    currentAccount.movements.push(-amount)
    recieverAcc.movements.push(amount)
    currentAccount.movementsDates.push(new Date().toISOString)
    recieverAcc.movementsDates.push(new Date().toISOString)
    updateUI(currentAccount);
})

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString)
        updateUI(currentAccount)
    }
    inputLoanAmount.value = '';


})

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (inputCloseUsername.value === currentAccount.username
        && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username)
        accounts.splice(index, 1);

        containerApp.style.opacity = 0;
    }
    inputClosePin.value = inputCloseUsername.value = '';

})

let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted)
    sorted = !sorted
})