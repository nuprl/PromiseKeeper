
SCRIPT ENTER (RaceReject2.js:1:1:14:4) RaceReject2_jalangi_.js RaceReject2.js
*** call to Promise() constructor at (RaceReject2.js:1:9:3:3) creates promise p0
*** return from call to Promise() constructor at (RaceReject2.js:1:9:3:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (RaceReject2.js:4:10:6:3) creates promise p1
*** return from call to Promise() constructor at (RaceReject2.js:4:10:6:3) associates OID obj5 with promise p1
*** call to race() on array [Promise p0,Promise p1] at (RaceReject2.js:8:10:8:31) creates promise p2
*** resolve identity  registered at (RaceReject2.js:8:10:14:3) on p2
*** reject identity  registered at (RaceReject2.js:8:10:14:3) on p2
*** call to then() on promise p2 at (RaceReject2.js:8:10:14:3) creates promise p3
SCRIPT EXIT (RaceReject2.js:1:1:14:4)
*** function  returned value six at (RaceReject2.js:5:5:5:35)
*** promise p1 REJECTED with value six at (RaceReject2.js:5:5:5:35)
*** function  returned value six at (RaceReject2.js:8:10:14:3)
*** promise p3 RESOLVED with explicitly returned value six at (RaceReject2.js:8:10:14:3)
*** function  returned value five at (RaceReject2.js:2:5:2:37)
*** promise p0 RESOLVED with value five at (RaceReject2.js:2:5:2:37)
** endExecution for unit-test
