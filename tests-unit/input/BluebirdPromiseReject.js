// example from https://gist.github.com/chrisabrams/11011880 [modified]

var shouldGiveError = true;

new Promise(function (resolve, reject) {
    if (shouldGiveError)
    return reject("Oh no!, An error occurred!")

    resolve("This will be printed to the console on success");
})
.then(console.log)
    .catch(console.error)