var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

localStorage.setItem('myFirstKey', 'myFirstValue');
console.log(localStorage.getItem('myFirstKey'));

exports.saveLocalStorage = function(objectName, data) {
  console.log('save', objectName, data)

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
  if (!objectName) {
    return allStorage();
  }
  console.log('get', objectName)
  return localStorage.getItem(String(objectName));
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