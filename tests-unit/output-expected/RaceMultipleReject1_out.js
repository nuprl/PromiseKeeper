
SCRIPT ENTER (RaceMultipleReject1.js:1:1:30:4) RaceMultipleReject1_jalangi_.js RaceMultipleReject1.js
*** call to Promise() constructor at (RaceMultipleReject1.js:5:9:7:3) creates promise p0
*** return from call to Promise() constructor at (RaceMultipleReject1.js:5:9:7:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (RaceMultipleReject1.js:8:10:10:3) creates promise p1
*** promise p1 REJECTED with value 1 at (RaceMultipleReject1.js:9:5:9:19)
*** return from call to Promise() constructor at (RaceMultipleReject1.js:8:10:10:3) associates OID obj5 with promise p1
*** call to race() on array [Promise p0,Promise p1] at (RaceMultipleReject1.js:12:10:12:31) creates promise p2
*** resolve identity  registered at (RaceMultipleReject1.js:12:10:18:3) on p2
*** reject identity  registered at (RaceMultipleReject1.js:12:10:18:3) on p2
*** call to then() on promise p2 at (RaceMultipleReject1.js:12:10:18:3) creates promise p3
*** call to Promise() constructor at (RaceMultipleReject1.js:20:10:22:3) creates promise p4
*** promise p4 REJECTED with value 2 at (RaceMultipleReject1.js:21:5:21:14)
*** return from call to Promise() constructor at (RaceMultipleReject1.js:20:10:22:3) associates OID obj15 with promise p4
*** call to race() on array [Promise p3,Promise p4] at (RaceMultipleReject1.js:24:10:24:32) creates promise p5
*** resolve identity  registered at (RaceMultipleReject1.js:24:10:30:3) on p5
*** reject identity  registered at (RaceMultipleReject1.js:24:10:30:3) on p5
*** call to then() on promise p5 at (RaceMultipleReject1.js:24:10:30:3) creates promise p6
SCRIPT EXIT (RaceMultipleReject1.js:1:1:30:4)
*** function  returned value 1 at (RaceMultipleReject1.js:12:10:18:3)
*** promise p3 RESOLVED with explicitly returned value 1 at (RaceMultipleReject1.js:12:10:18:3)
*** function  returned value 2 at (RaceMultipleReject1.js:24:10:30:3)
*** promise p6 RESOLVED with explicitly returned value 2 at (RaceMultipleReject1.js:24:10:30:3)
*** function  returned value five at (RaceMultipleReject1.js:6:5:6:37)
*** promise p0 RESOLVED with value five at (RaceMultipleReject1.js:6:5:6:37)
** endExecution for unit-test
