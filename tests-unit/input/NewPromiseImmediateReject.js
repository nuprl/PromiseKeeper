// create a promise by calling the Promise constructor, and immediately reject it

var p = new Promise(function (resolve, reject){ reject(42) });