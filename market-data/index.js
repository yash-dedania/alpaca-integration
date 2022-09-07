const WebSocket = require('ws');

const url = 'wss://stream.data.sandbox.alpaca.markets/v2/iex'
const connection = new WebSocket(url);
let isAuthenticated = false;
let isSubScribed = false;
const symbolCodes = ['NFLX'];

const Alpaca = require("@alpacahq/alpaca-trade-api");
const API_KEY = "CKPZYZU0DXZ1JKXY0EN9";
const API_SECRET = "E7pKKmqbyqKrHEUPJ5uwQdCAut3xgnhDGGcY4351";

class DataStream {
  constructor({ apiKey, secretKey, feed }) {
    this.alpaca = new Alpaca({
      keyId: apiKey,
      secretKey,
      feed,
    });

    const socket = this.alpaca.data_stream_v2;

    socket.onConnect(function () {
      socket.subscribeForBars(symbolCodes);
      socket.subscribeForStatuses(["*"]);
    });

    socket.onError((err) => {
      console.log(err);
    });


    socket.onStockBar((bar) => {
      console.log('Bar Data: ');
      console.log(bar);
    });

    socket.onStatuses((s) => {
      console.log(s);
    });

    socket.onStateChange((state) => {
      console.log(state);
    });

    socket.onDisconnect(() => {
      console.log("Disconnected");
    });

    socket.connect();

    // unsubscribe from FB after a second
    setTimeout(() => {
      
    }, 1000);
  }
}

let stream = new DataStream({
  apiKey: API_KEY,
  secretKey: API_SECRET,
  feed: "iex",
  APCA_API_BASE_URL:"wss://stream.data.sandbox.alpaca.markets"
});

// connection.onopen = () => {
//   console.log('On Open!');
// }

// connection.onerror = (error) => {
//   console.log(`WebSocket error: ${error}`);
//   isAuthenticated = false;
// }



// function authenticate(){
//   console.log('Authenticate!');
//   connection.send(JSON.stringify({ "action": "auth", "key": "CKPZYZU0DXZ1JKXY0EN9", "secret": "E7pKKmqbyqKrHEUPJ5uwQdCAut3xgnhDGGcY4351" }));
// }
// connection.onmessage = (e) => {
//   console.log('here Messages: !');
//   let message = JSON.parse(e.data);
//   message = message[0];
//   if(!isAuthenticated){
//     authenticate();
//   } else if([404,402,401].includes(message.code)){
//     isAuthenticated = false;
//     authenticate();
//   } else if(403 == message.code){
//     isAuthenticated = true;
//   }
//   if(message.msg == "authenticated"){
//     console.log('Authenticated!');
//     isAuthenticated = true;
//   }
//   if(!isSubScribed){
//     isSubScribed = true;
//     console.log(`Time Stamp: ${new Date()} Subscribed to ${symbolCodes}`)
//     connection.send(JSON.stringify({ "action": "subscribe", "bars": symbolCodes }));
    
    
//   }
  
//   console.log(`Time Stamp: ${new Date()} \n Data: ${JSON.stringify(message)}`);
  
// }
