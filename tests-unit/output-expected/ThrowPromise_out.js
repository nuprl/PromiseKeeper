
SCRIPT ENTER (ThrowPromise.js:1:1:13:4) ThrowPromise_jalangi_.js ThrowPromise.js
*** call to Promise.resolve() at (ThrowPromise.js:1:10:1:29) creates promise p0
*** return from call to Promise.resolve() at (ThrowPromise.js:1:10:1:29) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 17 at (ThrowPromise.js:1:10:1:29)
*** call to Promise.resolve() at (ThrowPromise.js:2:10:2:29) creates promise p1
*** return from call to Promise.resolve() at (ThrowPromise.js:2:10:2:29) associates OID obj5 with promise p1
*** promise p1 RESOLVED with value 18 at (ThrowPromise.js:2:10:2:29)
*** resolve identity  registered at (ThrowPromise.js:4:10:6:3) on p1
*** reject identity _default registered at (ThrowPromise.js:4:10:6:3) on p1
*** call to then() on promise p1 at (ThrowPromise.js:4:10:6:3) creates promise p2
*** resolve identity  registered at (ThrowPromise.js:8:1:13:3) on p2
*** reject identity  registered at (ThrowPromise.js:8:1:13:3) on p2
*** call to then() on promise p2 at (ThrowPromise.js:8:1:13:3) creates promise p3
SCRIPT EXIT (ThrowPromise.js:1:1:13:4)
*** function  returned value [object Object] at (ThrowPromise.js:4:10:6:3)
*** promise p2 REJECTED with value [object Object] at (ThrowPromise.js:4:10:6:3)
*** function  returned value undefined at (ThrowPromise.js:8:1:13:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (ThrowPromise.js:8:1:13:3)
** endExecution for unit-test
