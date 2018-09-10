var arr = [1, 2, 3];
var resultArr = [];

for (var i = 0; i < arr.length; i ++) {
    resultArr.push(foo(arr[i]).then(function (x) {
        return x * 10;
    }));
}

function foo (x) {
    return Promise.resolve(x);
}