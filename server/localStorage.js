var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

localStorage.setItem("temperature", "50");
localStorage.setItem("humidity", "0");
localStorage.setItem("sun", "true");
localStorage.setItem("Clouds", "50");
localStorage.setItem("rain", "20");
localStorage.setItem("moisture-sensors", "50");
localStorage.setItem("recent-updates", String([]));
localStorage.setItem("time", "6:00");

exports.saveLocalStorage = function(objectName, data) {
  if (!objectName) {
    return { error: "No object name" };
  }
  if (!data) {
    return { error: "No data" };
  }
  localStorage.setItem(String(objectName), String(data));
  return localStorage.getItem(objectName);
};

exports.getLocalStorage = function(objectName) {
  console.log("getting->", objectName);
  if (!objectName) {
    return allStorage();
  }
  return {
    value: localStorage.getItem(String(objectName)),
    objectName: objectName
  };
};

function allStorage() {
  var archive = {}, // Notice change here
    i = localStorage.length;

  while (i--) {
    archive[localStorage.key(i)] = {
      objectName: localStorage.key(i),
      value: localStorage.getItem(localStorage.key(i))
    };
  }

  return archive;
}
