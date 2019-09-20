var LocalStorage = require("node-localstorage").LocalStorage;
var colors = require("colors");
localStorage = new LocalStorage("./scratch");

initDatabse();

exports.saveLocalStorage = function(objectName, value) {
  if (!value) {
    return { error: "No object name" };
  }
  if (!value) {
    return { error: "No data" };
  }
  console.log(colors.green("saving " + objectName));
  localStorage.setItem(
    String(objectName),
    JSON.stringify({ objectName: objectName, value: value, active: true })
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
    archive[localStorage.key(i)] = JSON.parse(
      localStorage.getItem(localStorage.key(i))
    );
  }

  return archive;
}

function initDatabse() {
  var archive = {}; 
  var  i = localStorage.length;

  if (i<1) {
    localStorage.setItem("temperature", "50");
    localStorage.setItem("humidity", "50");
    localStorage.setItem("sun", "true");
    localStorage.setItem("clouds", "50");
    localStorage.setItem("rain", "50");
    localStorage.setItem("moisture-sensors", "50");
    localStorage.setItem("recent-updates", String([]));
    localStorage.setItem("time", "6:00");
  }

  //changed structure of database to json objects to account for active status
  while (i--) {
    localStorage.setItem(
      localStorage.key(i),
      JSON.stringify({
        objectName: localStorage.key(i),
        value: localStorage.getItem(localStorage.key(i)),
        active: true
      })
    );
  }
  console.log(colors.green("Databse Inititalized"));
}
