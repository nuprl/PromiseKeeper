
SCRIPT ENTER (LinkedPromises6.js:1:1:21:66) LinkedPromises6_jalangi_.js LinkedPromises6.js
*** call to Promise() constructor at (LinkedPromises6.js:4:9:6:3) creates promise p0
*** return from call to Promise() constructor at (LinkedPromises6.js:4:9:6:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (LinkedPromises6.js:8:9:8:66) creates promise p1
*** promise p1 RESOLVED with value bar at (LinkedPromises6.js:8:49:8:63)
*** return from call to Promise() constructor at (LinkedPromises6.js:8:9:8:66) associates OID obj5 with promise p1
*** resolve identity  registered at (LinkedPromises6.js:9:1:12:3) on p1
*** reject identity _default registered at (LinkedPromises6.js:9:1:12:3) on p1
*** call to then() on promise p1 at (LinkedPromises6.js:9:1:12:3) creates promise p2
*** resolve identity  registered at (LinkedPromises6.js:9:1:18:3) on p2
*** reject identity  registered at (LinkedPromises6.js:9:1:18:3) on p2
*** call to then() on promise p2 at (LinkedPromises6.js:9:1:18:3) creates promise p3
SCRIPT EXIT (LinkedPromises6.js:1:1:21:66)
promise p2 LINKED with promise p0
*** function  returned value foo at (LinkedPromises6.js:5:5:5:36)
*** promise p0 REJECTED with value foo at (LinkedPromises6.js:5:5:5:36)
*** function  returned value foo at (LinkedPromises6.js:9:1:12:3)
*** promise p2 REJECTED with value foo linked from promise p0 at (LinkedPromises6.js:9:1:12:3)
*** function  returned value foo at (LinkedPromises6.js:9:1:18:3)
*** promise p3 RESOLVED with explicitly returned value foo at (LinkedPromises6.js:9:1:18:3)
** endExecution for unit-test
