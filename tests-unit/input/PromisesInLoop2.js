[1, 2].forEach(function (element) {
    return foo(element).then(function (data) {
        return data;
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log('Error: ', error);
    });
});

function foo (x) {
    return Promise.resolve(x);
}