var colors = require("colors");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
var axios = require("axios");

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
    return allStorage();
  }
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
      JSON.stringify([]),
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

async function currentWeather() {
  return new Promise(async function(resolve, reject) {
    const access = "31d95b55c973a21c020ae5235b73d16e";
    var weather = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=Phoenix&appid=${access}&units=imperial`
    );
    var futureweather = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?q=Phoenix&appid=${access}&units=imperial&mode=json`
    );
    weather.data.futureweather = futureweather.data;
    resolve(weather.data);
  });
}

exports.systemCheckComplete = function() {
  return new Promise(function(resolve, reject) {
    console.log("systemCheckComplete");
    var allStors = allStorage();
    var nowTime = new Date();
    for (var key in allStors) {
      if (allStors.hasOwnProperty(key)) {
        exports.saveLocalStorage(allStors[key].objectName);
      }
    }

    resolve(true);
  });
};

exports.logSystemRun = async function(forcedRan) {
  return new Promise(async function(resolve, reject) {
    let weather = await currentWeather();
    let timestamp = new Date();
    let systemRan = String(forcedRan) || "false";
    let temperature = {
      value: weather.main.temp,
      threshhold: exports.getLocalStorage("temperature").value
    };
    let humidity = {
      value: weather.main.humidity,
      threshhold: exports.getLocalStorage("humidity").value
    };
    let rain = {
      value: weather.futureweather.list[0].clouds.all,
      threshhold: exports.getLocalStorage("rain").value
    };
    let sensors = createSensorsArray();
    let sensorsThreshold = {
      value: getMoistureValue(),
      threshhold: getMoistureThreshhold()
    };
    //console.log(colors.red(sensorsThreshold))
    let logJSON = {
      timestamp: timestamp,
      systemRan: systemRan,
      temperature: temperature,
      humidity: humidity,
      rain: rain,
      sensors: sensors,
      sensorsThreshold: sensorsThreshold
    };

    var oldArray = JSON.parse(exports.getLocalStorage("recentUpdates").value);
    oldArray.push(logJSON);
    exports.saveLocalStorage("recentUpdates", JSON.stringify(oldArray));
    resolve(true);
  });

  function createSensorsArray() {
    var returnArray = [];
    //console.log(exports.getLocalStorage("moistureSensors").value)
    var sensors = JSON.parse(exports.getLocalStorage("moistureSensors").value);
    sensors.forEach(element => {
      returnArray.push({ name: element.sensor, value: element.moist });
    });
    return returnArray;
  }
  function getMoistureValue() {
    var returnVal = 0;
    //console.log(exports.getLocalStorage("moistureSensors").value)
    var sensors = JSON.parse(exports.getLocalStorage("moistureSensors").value);
    sensors.forEach(element => {
      if (element.moist == "true") {
        returnVal++;
      }
    });
    return returnVal;
  }
  function getMoistureThreshhold() {
    var returnVal = 0;
    //console.log(exports.getLocalStorage("moistureSensors").value)
    var sensors = JSON.parse(exports.getLocalStorage("moistureSensors").value);
    sensors.forEach(element => {
      if (element.mustBeTrue == "true") {
        returnVal++;
      }
    });
    return returnVal;
  }
};

initDatabse();
//exports.logSystemRun(true);
