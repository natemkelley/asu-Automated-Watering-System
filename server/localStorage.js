var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

exports.saveLocalStorage = function(objectName, data) {
  if (!objectName) {
    return { error: "No object name" };
  }
  if (!data) {
    return { error: "No data" };
  }

  localStorage.setItem(objectName, data);
  return localStorage.getItem(objectName);
};

exports.getLocalStorage = function(objectName) {
  if (!objectName) {
    return allStorage();
  }

  return localStorage.getItem(objectName);
};

function allStorage() {
    var archive = {}, // Notice change here
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        archive[ keys[i] ] = localStorage.getItem( keys[i] );
    }

    return archive;
}