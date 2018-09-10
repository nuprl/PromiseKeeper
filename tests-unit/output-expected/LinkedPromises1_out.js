
SCRIPT ENTER (LinkedPromises1.js:1:1:14:66) LinkedPromises1_jalangi_.js LinkedPromises1.js
*** call to Promise() constructor at (LinkedPromises1.js:3:10:3:64) creates promise p0
*** promise p0 RESOLVED with value 42 at (LinkedPromises1.js:3:50:3:61)
*** return from call to Promise() constructor at (LinkedPromises1.js:3:10:3:64) associates OID obj3 with promise p0
*** call to Promise.resolve() at (LinkedPromises1.js:4:10:4:29) creates promise p1
*** return from call to Promise.resolve() at (LinkedPromises1.js:4:10:4:29) associates OID obj5 with promise p1
*** promise p1 RESOLVED with value 17 at (LinkedPromises1.js:4:10:4:29)
*** resolve identity  registered at (LinkedPromises1.js:5:1:8:3) on p0
*** reject identity _default registered at (LinkedPromises1.js:5:1:8:3) on p0
*** call to then() on promise p0 at (LinkedPromises1.js:5:1:8:3) creates promise p2
*** resolve identity  registered at (LinkedPromises1.js:5:1:11:3) on p2
*** reject identity _default registered at (LinkedPromises1.js:5:1:11:3) on p2
*** call to then() on promise p2 at (LinkedPromises1.js:5:1:11:3) creates promise p3
SCRIPT EXIT (LinkedPromises1.js:1:1:14:66)
promise p2 LINKED with promise p1
*** function  returned value 17 at (LinkedPromises1.js:5:1:8:3)
*** promise p2 RESOLVED with explicitly returned value 17 linked from promise p1 at (LinkedPromises1.js:5:1:8:3)
*** function  returned value 17 at (LinkedPromises1.js:5:1:11:3)
*** promise p3 RESOLVED with explicitly returned value 17 at (LinkedPromises1.js:5:1:11:3)
** endExecution for unit-test
