fetchResult('query')
    .then(function(result) {
        processResult(result);
    })
    .then(function(processedResult) {
        console.log('processed result', processedResult);
    })
    .catch(function(error) {
        console.error(error);
    });

function fetchResult (q) {
    return new Promise (function (resolve, reject) {
        resolve(1);
    });
}

function processResult (x) {
    console.log(x);
}