var colors = require("colors");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");

exports.saveLocalStorage = function(objectName, value, active, lastRunTime) {
  if (!objectName) {
    return { error: "No object name" };
  }
  if (value == "null" || !value) {
    value = JSON.parse(localStorage.getItem(objectName)).value;
  }
  if (!active || active == "null") {
    active = JSON.parse(localStorage.getItem(objectName)).active;
  }

  console.log(
    colors.green(
      "saving " +
        objectName +
        " with a value of " +
        value +
        " and a active of " +
        active
    )
  );
  localStorage.setItem(
    String(objectName),
    JSON.stringify({
      objectName: objectName,
      value: value,
      active: active || "and",
      error: false,
      lastRunTime: lastRunTime || new Date()
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
    localStorage.setItem("rain", "50");
    localStorage.setItem("humidity", "50");
    i = localStorage.length;
  }

  //changed structure of database to json objects to account for active status
  while (i--) {
    if (!isJson(localStorage.key(i))) {
      exports.saveLocalStorage(
        localStorage.key(i),
        localStorage.getItem(localStorage.key(i)),
        "and"
      );
    }
  }
  if (localStorage.length < 4) {
    exports.saveLocalStorage(
      "recentUpdates",
      JSON.stringify([{}]),
      "recent-updates"
    );
    exports.saveLocalStorage(
      "moistureSensors",
      JSON.stringify([
        {
          sensor: "Sensor 1",
          moist: "true",
          lastRunTime: String(new Date()),
          mustBeTrue: "false"
        },
        {
          sensor: "Sensor 2",
          moist: "false",
          lastRunTime: String(new Date()),
          mustBeTrue: "true"
        },
        {
          sensor: "Sensor 3",
          moist: "true",
          lastRunTime: String(new Date()),
          mustBeTrue: "false"
        }
      ]),
      "and"
    );
    exports.saveLocalStorage("time", JSON.stringify(["06:00", "06:30"]), true);
    exports.saveLocalStorage("timer", "15", true);
    exports.saveLocalStorage(
      "currentTriggers",
      JSON.stringify(["time", "timer"]),
      true
    );
    console.log(colors.green("Databse Inititalized"));
  }
}

function getActiveStatue(objectName) {
  return "disabled";
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

exports.systemCheckComplete = function() {
  return new Promise(function(resolve, reject) {
    console.log("systemCheckComplete");
    var allStors = allStorage();
    var nowTime = new Date();
    for (var key in allStors) {
      if (allStors.hasOwnProperty(key)) {
        //console.log(allStors[key].objectName);
        exports.saveLocalStorage(allStors[key].objectName);
      }
    }

    resolve(true);
  });
};

//initDatabse();
exports.systemCheckComplete();

//console.log(allStorage());
