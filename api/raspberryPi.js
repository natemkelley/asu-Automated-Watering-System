//https://www.npmjs.com/package/rpi-gpio
const localStorage = require("../server/localStorage.js");
const colors = require('colors')
//const gpio = require("rpi-gpio");
//const gpiop = gpio.promise;

var INTERVAL = null;
var TIMEOUT = null;
var TIMER = null;
var INTERVAL_ARRAY = null;

function startINTERVAL(milliseconds) {
  console.log("starting...");
  INTERVAL = setINTERVAL(myTriggerFunction, milliseconds);
}

function stopINTERVAL() {
  console.log("stopping...");
  clearINTERVAL(INTERVAL);
  console.log("stopped");
}

function startTIMEOUT(milliseconds) {
  TIMEOUT = setTIMEOUT(myTriggerFunction, milliseconds);
}

function stopTIMEOUT() {
  clearTIMEOUT(TIMEOUT);
}

function myTriggerFunction() {
  var d = new Date();
  var t = d.toLocaleTimeString();
  console.log(t);
}

//still need to do this
function getAndSaveMoistureLevels(){
  return new Promise(function(resolve, reject) {
    console.log('getAndSaveMoistureLevels...')
    resolve([])
  })
}

//still need to do this
function runSystem(){
  return new Promise(function(resolve, reject) {
    console.log('run system...')
  })
}

//still need to do this
exports.handleNewTimer = function() {
  return new Promise(async function(resolve, reject) {
    resolve(true);
  });
};

//still need to do this
exports.handleNewTime = function() {
  return new Promise(async function(resolve, reject) {
    resolve(true);
  });
};

exports.systemCheck = function(forceRunOrCheck) {
  return new Promise(async function(resolve, reject) {
    console.log("system checking... raspberry pi");
    await getAndSaveMoistureLevels();
    await localStorage.systemCheck(forceRunOrCheck);
    resolve(true);
  });
};

exports.forceSystemRun = function() {
  return new Promise(async function(resolve, reject) {
    console.log("forcing system run... raspberry pi");
    await runSystem();
    await localStorage.systemCheck('forced');
    resolve(true);
  });
};

runSystem();
exports.systemCheck();