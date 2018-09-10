// The Collection Kerfuffle
// You have an array of items and you want to do something asynchronous on each of them.
function workMyCollection(arr) {
    var resultArr = [];
    function _recursive(idx) {
        console.log(idx);
        if (idx >= resultArr.length) return resultArr;

        return doSomethingAsync(arr[idx]).then(function(res) {
            resultArr.push(res);
            return _recursive(idx + 1);
        });
    }
    return _recursive(0);
}

function doSomethingAsync (x) {
    return Promise.resolve(x);
}

workMyCollection([1, 2]);