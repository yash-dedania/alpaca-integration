// Uncomment the code by removing the slashes
const axios = require('axios');
const token = "Q0tQWllaVTBEWFoxSktYWTBFTjk6RTdwS0ttcWJ5cUtySEVVUEo1dXdRZENBdXQzeGduaERHR2NZNDM1MQ==";
const alpacaApiInstance = axios.create({
  baseURL: 'https://broker-api.sandbox.alpaca.markets/',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:59.0)   Gecko/20100101 Firefox/59.0",
    'Authorization': `Basic ${token}`
  }
});

const sseLib = require('better-sse');
const accountId = '63eec16c-cef4-4725-9138-9a9e3252eb80';

// this is also not working
// const sse = new EventSource("https://broker-api.sandbox.alpaca.markets/v1/events/trades/");

const sse = new sseLib.EventSource("https://broker-api.sandbox.alpaca.markets/v1/events/trades/");

sse.addEventListener("message", ({ data }) => {
  console.log(data);
});

function callbackHandler(promise, callback) {
  if (callback !== null && typeof callback === 'function') {
    promise.then(function (data) {
      return callback(null, data);
    }).catch(function (err) {
      return callback(err);
    });
  } else {
    return promise;
  }
}

function placeOrder(isLimitOrder = false, limitPrice = null, callback) {
  const promise = new Promise(function (resolve, reject) {
    const body = {
      "asset_id": "bb2a26c0-4c77-4801-8afc-82e8142ac7b8",
      "symbol": "NFLX",
      "qty": 5,
      "type": isLimitOrder ? "limit" : "market",
      "side": "buy",
      "time_in_force": "day",
      "limit_price": limitPrice,
      "extended_hours": false
    };
    alpacaApiInstance.post(`/v1/trading/accounts/${accountId}/orders`, body)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        console.error(err);
        return reject(err);
      })

  });

  return callbackHandler(promise, callback);
}



function fetchTradeUpdates(since, until, callback) {
  const promise = new Promise(function (resolve, reject) {
    let params = {};
    if (since && until) {
      params = {
        since: since,
        until: until
      };
    }
    console.log('params: ', params);
    alpacaApiInstance.get(`/v1/events/trades/`, { params })
      .then((response) => {
        console.log(' Data Response: ', response.data);
      })
      .catch((err) => {
        console.error(err);
        return reject(err);
      });
  });

  return callbackHandler(promise, callback);
}

// Case 1: Setting until time as todays date

// placeOrder()
//   .then((response)=>{
//     console.log('Order Placed Successfully Case 1!: ',response.id);
//     return fetchTradeUpdates('2022-08-21','2022-08-22');
//   })
//   .catch((err) =>{
//     console.error(err);
//   });

/* Output : 
Order Placed Successfully!:  6f0c5731-446c-414c-8b4d-ff62f88c60b2
params:  { since: '2022-08-21', until: '2022-08-22' }
 Data Response:  : welcome to the Alpaca events
*/


// Case 2: Not Setting any date
// placeOrder()
//   .then((response)=>{
//     console.log('Order Placed Successfully Case 2!: ',response.id);
//     return fetchTradeUpdates();
//   })
//   .catch((err) =>{
//     console.error(err);
//   });


// Case 3: Placing Limit Order
placeOrder(true, 226.09)
  .then((response) => {
    console.log('Order Placed Successfully Case 3 Limit Order!: ', response);
    // return fetchTradeUpdates();
  })
  .catch((err) => {
    console.error(err);
  });




