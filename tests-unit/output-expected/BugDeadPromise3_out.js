
SCRIPT ENTER (BugDeadPromise3.js:1:1:20:1) BugDeadPromise3_jalangi_.js BugDeadPromise3.js
*** call to Promise() constructor at (BugDeadPromise3.js:2:10:4:3) creates promise p0
*** return from call to Promise() constructor at (BugDeadPromise3.js:2:10:4:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (BugDeadPromise3.js:6:10:8:3) creates promise p1
*** promise p1 RESOLVED with value 42 at (BugDeadPromise3.js:7:5:7:16)
*** return from call to Promise() constructor at (BugDeadPromise3.js:6:10:8:3) associates OID obj5 with promise p1
*** resolve identity  registered at (BugDeadPromise3.js:10:10:14:3) on p1
*** reject identity _default registered at (BugDeadPromise3.js:10:10:14:3) on p1
*** call to then() on promise p1 at (BugDeadPromise3.js:10:10:14:3) creates promise p2
*** resolve identity  registered at (BugDeadPromise3.js:16:10:19:3) on p2
*** reject identity _default registered at (BugDeadPromise3.js:16:10:19:3) on p2
*** call to then() on promise p2 at (BugDeadPromise3.js:16:10:19:3) creates promise p3
SCRIPT EXIT (BugDeadPromise3.js:1:1:20:1)
promise p2 LINKED with promise p0
** endExecution for unit-test
