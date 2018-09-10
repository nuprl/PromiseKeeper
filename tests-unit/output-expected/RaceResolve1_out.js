
SCRIPT ENTER (RaceResolve1.js:1:1:13:3) RaceResolve1_jalangi_.js RaceResolve1.js
*** call to Promise() constructor at (RaceResolve1.js:3:10:5:3) creates promise p0
*** promise p0 RESOLVED with value 1 at (RaceResolve1.js:4:5:4:15)
*** return from call to Promise() constructor at (RaceResolve1.js:3:10:5:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (RaceResolve1.js:6:10:8:3) creates promise p1
*** promise p1 REJECTED with value 2 at (RaceResolve1.js:7:5:7:14)
*** return from call to Promise() constructor at (RaceResolve1.js:6:10:8:3) associates OID obj5 with promise p1
*** call to race() on array [Promise p0,Promise p1] at (RaceResolve1.js:10:1:10:23) creates promise p2
*** resolve identity  registered at (RaceResolve1.js:10:1:13:3) on p2
*** reject identity _default registered at (RaceResolve1.js:10:1:13:3) on p2
*** call to then() on promise p2 at (RaceResolve1.js:10:1:13:3) creates promise p3
SCRIPT EXIT (RaceResolve1.js:1:1:13:3)
*** function  returned value 1 at (RaceResolve1.js:10:1:13:3)
*** promise p3 RESOLVED with explicitly returned value 1 at (RaceResolve1.js:10:1:13:3)
** endExecution for unit-test
