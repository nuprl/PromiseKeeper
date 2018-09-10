
SCRIPT ENTER (NewPromiseThenImplicitReturns.js:1:1:9:4) NewPromiseThenImplicitReturns_jalangi_.js NewPromiseThenImplicitReturns.js
*** call to Promise() constructor at (NewPromiseThenImplicitReturns.js:3:9:3:63) creates promise p0
*** promise p0 RESOLVED with value 42 at (NewPromiseThenImplicitReturns.js:3:48:3:59)
*** return from call to Promise() constructor at (NewPromiseThenImplicitReturns.js:3:9:3:63) associates OID obj3 with promise p0
*** resolve identity f2 registered at (NewPromiseThenImplicitReturns.js:4:10:6:3) on p0
*** reject identity _default registered at (NewPromiseThenImplicitReturns.js:4:10:6:3) on p0
*** call to then() on promise p0 at (NewPromiseThenImplicitReturns.js:4:10:6:3) creates promise p1
*** resolve identity f3 registered at (NewPromiseThenImplicitReturns.js:7:10:9:3) on p1
*** reject identity _default registered at (NewPromiseThenImplicitReturns.js:7:10:9:3) on p1
*** call to then() on promise p1 at (NewPromiseThenImplicitReturns.js:7:10:9:3) creates promise p2
SCRIPT EXIT (NewPromiseThenImplicitReturns.js:1:1:9:4)
*** function f2 returned value undefined at (NewPromiseThenImplicitReturns.js:4:10:6:3)
*** promise p1 RESOLVED with implicitly returned value undefined at (NewPromiseThenImplicitReturns.js:4:10:6:3)
*** function f3 returned value undefined at (NewPromiseThenImplicitReturns.js:7:10:9:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (NewPromiseThenImplicitReturns.js:7:10:9:3)
** endExecution for unit-test
