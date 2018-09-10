
SCRIPT ENTER (LinkedPromises3.js:1:1:17:66) LinkedPromises3_jalangi_.js LinkedPromises3.js
*** call to Promise() constructor at (LinkedPromises3.js:3:10:3:64) creates promise p0
*** promise p0 RESOLVED with value 42 at (LinkedPromises3.js:3:50:3:61)
*** return from call to Promise() constructor at (LinkedPromises3.js:3:10:3:64) associates OID obj3 with promise p0
*** call to Promise.reject() at (LinkedPromises3.js:4:10:4:28) creates promise p1
*** return from call to Promise.reject() at (LinkedPromises3.js:4:10:4:28) associates OID obj5 with promise p1
*** promise p1 REJECTED with value 17 at (LinkedPromises3.js:4:10:4:28)
*** resolve identity  registered at (LinkedPromises3.js:5:1:8:3) on p0
*** reject identity _default registered at (LinkedPromises3.js:5:1:8:3) on p0
*** call to then() on promise p0 at (LinkedPromises3.js:5:1:8:3) creates promise p2
*** resolve identity  registered at (LinkedPromises3.js:5:1:14:3) on p2
*** reject identity  registered at (LinkedPromises3.js:5:1:14:3) on p2
*** call to then() on promise p2 at (LinkedPromises3.js:5:1:14:3) creates promise p3
SCRIPT EXIT (LinkedPromises3.js:1:1:17:66)
promise p2 LINKED with promise p1
*** function  returned value 17 at (LinkedPromises3.js:5:1:8:3)
*** promise p2 REJECTED with value 17 linked from promise p1 at (LinkedPromises3.js:5:1:8:3)
*** function  returned value 17 at (LinkedPromises3.js:5:1:14:3)
*** promise p3 RESOLVED with explicitly returned value 17 at (LinkedPromises3.js:5:1:14:3)
** endExecution for unit-test
