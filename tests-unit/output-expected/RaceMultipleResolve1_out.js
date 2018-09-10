
SCRIPT ENTER (RaceMultipleResolve1.js:1:1:16:3) RaceMultipleResolve1_jalangi_.js RaceMultipleResolve1.js
*** call to Promise() constructor at (RaceMultipleResolve1.js:1:10:3:3) creates promise p0
*** promise p0 RESOLVED with value 1 at (RaceMultipleResolve1.js:2:5:2:15)
*** return from call to Promise() constructor at (RaceMultipleResolve1.js:1:10:3:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (RaceMultipleResolve1.js:4:10:6:3) creates promise p1
*** promise p1 REJECTED with value 2 at (RaceMultipleResolve1.js:5:5:5:14)
*** return from call to Promise() constructor at (RaceMultipleResolve1.js:4:10:6:3) associates OID obj5 with promise p1
*** call to race() on array [Promise p0,Promise p1] at (RaceMultipleResolve1.js:8:10:8:32) creates promise p2
*** resolve identity  registered at (RaceMultipleResolve1.js:8:10:11:3) on p2
*** reject identity _default registered at (RaceMultipleResolve1.js:8:10:11:3) on p2
*** call to then() on promise p2 at (RaceMultipleResolve1.js:8:10:11:3) creates promise p3
*** call to race() on array [Promise p0,Promise p1,Promise p3,Number 4] at (RaceMultipleResolve1.js:13:10:13:39) creates promise p4
*** resolve identity  registered at (RaceMultipleResolve1.js:13:10:16:3) on p4
*** reject identity _default registered at (RaceMultipleResolve1.js:13:10:16:3) on p4
*** call to then() on promise p4 at (RaceMultipleResolve1.js:13:10:16:3) creates promise p5
SCRIPT EXIT (RaceMultipleResolve1.js:1:1:16:3)
*** function  returned value 1 at (RaceMultipleResolve1.js:8:10:11:3)
*** promise p3 RESOLVED with explicitly returned value 1 at (RaceMultipleResolve1.js:8:10:11:3)
*** function  returned value 1 at (RaceMultipleResolve1.js:13:10:16:3)
*** promise p5 RESOLVED with explicitly returned value 1 at (RaceMultipleResolve1.js:13:10:16:3)
** endExecution for unit-test
