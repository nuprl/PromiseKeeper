
SCRIPT ENTER (NewPromiseThenThen.js:1:1:11:4) NewPromiseThenThen_jalangi_.js NewPromiseThenThen.js
*** call to Promise() constructor at (NewPromiseThenThen.js:3:9:3:63) creates promise p0
*** promise p0 RESOLVED with value 42 at (NewPromiseThenThen.js:3:49:3:60)
*** return from call to Promise() constructor at (NewPromiseThenThen.js:3:9:3:63) associates OID obj3 with promise p0
*** resolve identity f1 registered at (NewPromiseThenThen.js:4:10:7:3) on p0
*** reject identity _default registered at (NewPromiseThenThen.js:4:10:7:3) on p0
*** call to then() on promise p0 at (NewPromiseThenThen.js:4:10:7:3) creates promise p1
*** resolve identity f2 registered at (NewPromiseThenThen.js:8:10:11:3) on p1
*** reject identity _default registered at (NewPromiseThenThen.js:8:10:11:3) on p1
*** call to then() on promise p1 at (NewPromiseThenThen.js:8:10:11:3) creates promise p2
SCRIPT EXIT (NewPromiseThenThen.js:1:1:11:4)
*** function f1 returned value 84 at (NewPromiseThenThen.js:4:10:7:3)
*** promise p1 RESOLVED with explicitly returned value 84 at (NewPromiseThenThen.js:4:10:7:3)
*** function f2 returned value 85 at (NewPromiseThenThen.js:8:10:11:3)
*** promise p2 RESOLVED with explicitly returned value 85 at (NewPromiseThenThen.js:8:10:11:3)
** endExecution for unit-test
