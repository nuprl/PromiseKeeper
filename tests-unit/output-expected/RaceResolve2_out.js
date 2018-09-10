
SCRIPT ENTER (RaceResolve2.js:1:1:17:3) RaceResolve2_jalangi_.js RaceResolve2.js
*** call to Promise() constructor at (RaceResolve2.js:7:10:9:3) creates promise p0
*** return from call to Promise() constructor at (RaceResolve2.js:7:10:9:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (RaceResolve2.js:10:10:12:3) creates promise p1
*** promise p1 RESOLVED with value 2 at (RaceResolve2.js:11:5:11:15)
*** return from call to Promise() constructor at (RaceResolve2.js:10:10:12:3) associates OID obj5 with promise p1
*** call to race() on array [Promise p0,Promise p1] at (RaceResolve2.js:14:1:14:23) creates promise p2
*** resolve identity  registered at (RaceResolve2.js:14:1:17:3) on p2
*** reject identity _default registered at (RaceResolve2.js:14:1:17:3) on p2
*** call to then() on promise p2 at (RaceResolve2.js:14:1:17:3) creates promise p3
SCRIPT EXIT (RaceResolve2.js:1:1:17:3)
*** function  returned value 2 at (RaceResolve2.js:14:1:17:3)
*** promise p3 RESOLVED with explicitly returned value 2 at (RaceResolve2.js:14:1:17:3)
*** function  returned value 1 at (RaceResolve2.js:8:5:8:38)
*** promise p0 RESOLVED with value 1 at (RaceResolve2.js:8:5:8:38)
** endExecution for unit-test
