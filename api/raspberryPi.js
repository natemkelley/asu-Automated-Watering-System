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

exports.systemCheck = function() {
  return new Promise(async function(resolve, reject) {
    console.log("system checking... raspberry pi");
    await localStorage.updateAllLogsToMostRecentCheck();
    await logSystemRunRaspberry();
    resolve(true);
  });
};

exports.forceSystemRun = function() {
  return new Promise(function(resolve, reject) {
    console.log("forcing system run... raspberry pi");
    logSystemRunRaspberry(true).then(() => {
      resolve(true);
    });
  });
};

function logSystemRunRaspberry(systemRan) {
  return new Promise(function(resolve, reject) {
    console.log("raspberry log system run");
    let forceSystem = systemRan || "false";
    localStorage.logSystemRun(forceSystem).then(() => {
      resolve(true);
    });
  });
}
