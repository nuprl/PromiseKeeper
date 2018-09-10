
SCRIPT ENTER (LinkedPromises2.js:1:1:18:66) LinkedPromises2_jalangi_.js LinkedPromises2.js
*** call to Promise() constructor at (LinkedPromises2.js:4:9:6:3) creates promise p0
*** return from call to Promise() constructor at (LinkedPromises2.js:4:9:6:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (LinkedPromises2.js:8:9:8:66) creates promise p1
*** promise p1 RESOLVED with value bar at (LinkedPromises2.js:8:49:8:63)
*** return from call to Promise() constructor at (LinkedPromises2.js:8:9:8:66) associates OID obj5 with promise p1
*** resolve identity  registered at (LinkedPromises2.js:9:1:12:3) on p1
*** reject identity _default registered at (LinkedPromises2.js:9:1:12:3) on p1
*** call to then() on promise p1 at (LinkedPromises2.js:9:1:12:3) creates promise p2
*** resolve identity  registered at (LinkedPromises2.js:9:1:15:3) on p2
*** reject identity _default registered at (LinkedPromises2.js:9:1:15:3) on p2
*** call to then() on promise p2 at (LinkedPromises2.js:9:1:15:3) creates promise p3
SCRIPT EXIT (LinkedPromises2.js:1:1:18:66)
promise p2 LINKED with promise p0
*** function  returned value foo at (LinkedPromises2.js:5:5:5:37)
*** promise p0 RESOLVED with value foo at (LinkedPromises2.js:5:5:5:37)
*** function  returned value foo at (LinkedPromises2.js:9:1:12:3)
*** promise p2 RESOLVED with explicitly returned value foo linked from promise p0 at (LinkedPromises2.js:9:1:12:3)
*** function  returned value foo at (LinkedPromises2.js:9:1:15:3)
*** promise p3 RESOLVED with explicitly returned value foo at (LinkedPromises2.js:9:1:15:3)
** endExecution for unit-test
