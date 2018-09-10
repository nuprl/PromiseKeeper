
SCRIPT ENTER (PromisesInLoop1.js:1:1:12:2) PromisesInLoop1_jalangi_.js PromisesInLoop1.js
*** call to Promise.resolve() at (PromisesInLoop1.js:11:12:11:30) creates promise p0
*** return from call to Promise.resolve() at (PromisesInLoop1.js:11:12:11:30) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 1 at (PromisesInLoop1.js:11:12:11:30)
*** resolve identity  registered at (PromisesInLoop1.js:5:20:7:7) on p0
*** reject identity _default registered at (PromisesInLoop1.js:5:20:7:7) on p0
*** call to then() on promise p0 at (PromisesInLoop1.js:5:20:7:7) creates promise p1
*** call to Promise.resolve() at (PromisesInLoop1.js:11:12:11:30) creates promise p2
*** return from call to Promise.resolve() at (PromisesInLoop1.js:11:12:11:30) associates OID obj11 with promise p2
*** promise p2 RESOLVED with value 2 at (PromisesInLoop1.js:11:12:11:30)
*** resolve identity  registered at (PromisesInLoop1.js:5:20:7:7) on p2
*** reject identity _default registered at (PromisesInLoop1.js:5:20:7:7) on p2
*** call to then() on promise p2 at (PromisesInLoop1.js:5:20:7:7) creates promise p3
*** call to Promise.resolve() at (PromisesInLoop1.js:11:12:11:30) creates promise p4
*** return from call to Promise.resolve() at (PromisesInLoop1.js:11:12:11:30) associates OID obj19 with promise p4
*** promise p4 RESOLVED with value 3 at (PromisesInLoop1.js:11:12:11:30)
*** resolve identity  registered at (PromisesInLoop1.js:5:20:7:7) on p4
*** reject identity _default registered at (PromisesInLoop1.js:5:20:7:7) on p4
*** call to then() on promise p4 at (PromisesInLoop1.js:5:20:7:7) creates promise p5
SCRIPT EXIT (PromisesInLoop1.js:1:1:12:2)
*** function  returned value 10 at (PromisesInLoop1.js:5:20:7:7)
*** promise p1 RESOLVED with explicitly returned value 10 at (PromisesInLoop1.js:5:20:7:7)
*** function  returned value 20 at (PromisesInLoop1.js:5:20:7:7)
*** promise p3 RESOLVED with explicitly returned value 20 at (PromisesInLoop1.js:5:20:7:7)
*** function  returned value 30 at (PromisesInLoop1.js:5:20:7:7)
*** promise p5 RESOLVED with explicitly returned value 30 at (PromisesInLoop1.js:5:20:7:7)
** endExecution for unit-test
