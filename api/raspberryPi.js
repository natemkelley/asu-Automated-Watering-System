//https://www.npmjs.com/package/rpi-gpio
const localStorage = require("../server/localStorage.js");
const colors = require("colors");
const moment = require("moment");
//const gpio = require("rpi-gpio");
//const gpiop = gpio.promise;

var TIMER = null;
var INTERVAL_ARRAY = [];
var TIMER_ARRAY = [];

function startINTERVALS(times) {
  //console.log("starting intervals...", times);
  times.forEach((element, n) => {
    var milliseconds = Number(conformTimeToMillisecondUntil(element));
    INTERVAL_ARRAY[n] = setInterval(checkIfAndRunSystem, milliseconds);
  });
}

function conformTimeToMillisecondUntil(time) {
  var millisecondUntil = null;
  var currentTime = moment(new Date()).valueOf();
  var today = moment(new Date()).format("YYYY/MM/DD");
  var nextDay = false;
  var checkIfToday = moment(new Date(today + " " + time)).diff(
    moment(new Date())
  );

  if (checkIfToday < 0) {
    today = moment(new Date(today))
      .add(1, "days")
      .format("YYYY/MM/DD");
  }

  millisecondUntil = moment(new Date(today + " " + time)).valueOf() - currentTime;

  return millisecondUntil;
}

function stopINTERVALS() {
  //console.log(colors.red("clearing intervals", TIMER_ARRAY));
  TIMER_ARRAY.forEach((element, n) => {
    clearInterval(INTERVAL_ARRAY[n])
  });
}

function startTIMER(milliseconds) {
  //console.log(colors.green("starting timer " + milliseconds/1000/60));
  TIMER = setInterval(checkIfAndRunSystem, milliseconds);
}

function stopTIMER() {
  //console.log(colors.red("clearing TIMER!"));
  clearInterval(TIMER);
}

async function checkIfAndRunSystem() {
  console.log(colors.yellow('checkIfAndRunSystem'))
  var systemWillRun = await exports.systemCheck();
  if(String(systemWillRun) == 'true'){
    runSystem();
  }
}


//still need to do this
function runSystem() {
  return new Promise(function(resolve, reject) {
    console.log(colors.bgGreen('RUNNING SYSTEM!!!'));
    resolve(true);
  });
}

function minutesToMilliseconds(minutes) {
  let value = Number(minutes) * 60 * 1000;
  return value;
}

//still need to do this
exports.getAndSaveMoistureLevels = function () {
  return new Promise(function(resolve, reject) {
    console.log("still need to do this... getAndSaveMoistureLevels...");
    resolve([]);
  });
}

exports.handleNewTimer = function() {
  //console.log(colors.yellow("handleNewTimer"));
  return new Promise(async function(resolve, reject) {
    var currentTimer = TIMER;
    var localStorageTimerValue = Number(
      localStorage.getLocalStorage("timer").value
    );
    if (currentTimer != null) stopTIMER();
    startTIMER(minutesToMilliseconds(localStorageTimerValue));
    resolve(true);
  });
};

exports.handleNewTime = function() {
  //console.log(colors.yellow("handleNewTime"));
  return new Promise(async function(resolve, reject) {
    if (TIMER_ARRAY.length === 0) {
      startINTERVALS(JSON.parse(localStorage.getLocalStorage("time").value));
    } else {
      stopINTERVALS();
      startINTERVALS(JSON.parse(localStorage.getLocalStorage("time").value));
    }

    TIMER_ARRAY = JSON.parse(localStorage.getLocalStorage("time").value);

    resolve(true);
  });
};

exports.systemCheck = function(forceRunOrCheck) {
  return new Promise(async function(resolve, reject) {
    console.log("system checking... raspberry pi");
    let systemWillRun = await localStorage.systemCheck(forceRunOrCheck);
    resolve(true);
  });
};

exports.forceSystemRun = function() {
  return new Promise(async function(resolve, reject) {
    console.log("forcing system run... raspberry pi");
    await runSystem();
    await localStorage.systemCheck("forced");
    resolve(true);
  });
};

//checkIfAndRunSystem();