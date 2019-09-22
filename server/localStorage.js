var colors = require("colors");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

exports.saveLocalStorage = function(objectName, value, active) {
  if (!objectName) {
    return { error: "No object name" };
  }
  if (!value) {
    return { error: "No data" };
  }
  console.log(colors.green("saving " + objectName));
  localStorage.setItem(
    String(objectName),
    JSON.stringify({
      objectName: objectName,
      value: value,
      active: active || getActiveStatue(objectName),
      error: false
    })
  );
  return localStorage.getItem(objectName);
};

exports.getLocalStorage = function(objectName) {
  if (!objectName) {
    console.log("getting ->", "allStorage");
    return allStorage();
  }
  console.log("getting ->", objectName);
  return JSON.parse(localStorage.getItem(objectName));
};

function allStorage() {
  var archive = {}, // Notice change here
    i = localStorage.length;

  while (i--) {
    //console.log(isJson(localStorage.key(i)));
    if (isJson(localStorage.key(i))) {
      archive[localStorage.key(i)] = JSON.parse(
        localStorage.getItem(localStorage.key(i))
      );
    }
  }

  return archive;
}

function initDatabse() {
  var archive = {};
  var i = localStorage.length;

  if (i < 1) {
    localStorage.setItem("temperature", "50");
    localStorage.setItem("humidity", "50");
    localStorage.setItem("sun", "true");
    localStorage.setItem("clouds", "50");
    localStorage.setItem("rain", "50");
    localStorage.setItem("moisture-sensors", "50");
    localStorage.setItem("time", "6:00");
    localStorage.setItem("recent-updates", String([]));
    i = localStorage.length;
  }

  //changed structure of database to json objects to account for active status
  while (i--) {
    //console.log(isJson(localStorage.key(i)))
    if (!isJson(localStorage.key(i))) {
      exports.saveLocalStorage(
        localStorage.key(i),
        localStorage.getItem(localStorage.key(i))
      );
    }

    //console.log(localStorage.getItem(localStorage.key(i)));
  }
  console.log(colors.green("Databse Inititalized"));
}

function getActiveStatue(objectName) {
  return 'disabled';
}
function isJson(str) {
  //console.log(colors.green(localStorage.getItem(str).length < 5));
  if (localStorage.getItem(str).length < 5) {
    return false;
  }

  try {
    JSON.parse(localStorage.getItem(str));
  } catch (e) {
    //console.log(str, colors.red(e))
    return false;
  }

  return true;
}

initDatabse();
//console.log(allStorage());
