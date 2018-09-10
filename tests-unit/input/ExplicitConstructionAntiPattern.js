//Code copyright by Twisternha http://stackoverflow.com/a/19486699/995876 CC BY-SA 2.5
foo('Configurations', function (Restangular, MotorRestangular, $q) {
    var getConfigurations = function () {
        var origPromise = Promise.resolve(1);

        var deferred = new Promise(function (resolve, reject) {
            console.log('deferred p');
            this.deferredResolve = resolve;
        }.bind(this));

        origPromise.then(function (Motors) {
            var mapped = new Promise(function (resolve, reject) {
                console.log('mapped p')
            });
            deferredResolve(mapped);
        });
        return deferred;
    };

    return {
        config: getConfigurations()
    }
});

function foo (arg1, cb) {
    cb();
}