//https://www.npmjs.com/package/rpi-gpio
const localStorage = require("../server/localStorage.js");
//const gpio = require("rpi-gpio");
//const gpiop = gpio.promise;

var INTERVAL = null;
var TIMEOUT = null;

function startINTERVAL(milliseconds) {
  console.log("starting...");
  INTERVAL = setINTERVAL(myTimer, milliseconds);
}

function stopINTERVAL() {
  console.log("stopping...");
  clearINTERVAL(INTERVAL);
  console.log("stopped");
}

function startTIMEOUT(milliseconds) {
  TIMEOUT = setTIMEOUT(myTimer, milliseconds);
}

function stopTIMEOUT() {
  clearTIMEOUT(TIMEOUT);
}

function myTimer() {
  var d = new Date();
  var t = d.toLocaleTimeString();
  console.log(t);
}

exports = {
  getSystemStatus: () => {
    return "Hello";
  },

  setSystemPipeline: () => {
    return "Hello";
  }
};

function logSystemStatus() {
  console.log("logged");
}
