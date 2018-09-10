
SCRIPT ENTER (PromiseChain1.js:1:1:12:4) PromiseChain1_jalangi_.js PromiseChain1.js
*** call to Promise() constructor at (PromiseChain1.js:3:9:3:63) creates promise p0
*** promise p0 RESOLVED with value 17 at (PromiseChain1.js:3:49:3:60)
*** return from call to Promise() constructor at (PromiseChain1.js:3:9:3:63) associates OID obj3 with promise p0
*** resolve identity f1 registered at (PromiseChain1.js:4:10:7:3) on p0
*** reject identity _default registered at (PromiseChain1.js:4:10:7:3) on p0
*** call to then() on promise p0 at (PromiseChain1.js:4:10:7:3) creates promise p1
*** resolve identity f2 registered at (PromiseChain1.js:4:10:10:3) on p1
*** reject identity _default registered at (PromiseChain1.js:4:10:10:3) on p1
*** call to then() on promise p1 at (PromiseChain1.js:4:10:10:3) creates promise p2
*** resolve identity _default registered at (PromiseChain1.js:4:10:12:3) on p2
*** reject identity f3 registered at (PromiseChain1.js:4:10:12:3) on p2
*** call to catch() on promise p2 at (PromiseChain1.js:4:10:12:3) creates promise p3
SCRIPT EXIT (PromiseChain1.js:1:1:12:4)
*** function f1 returned value 18 at (PromiseChain1.js:4:10:7:3)
*** promise p1 RESOLVED with explicitly returned value 18 at (PromiseChain1.js:4:10:7:3)
*** function f2 threw value 19 at (PromiseChain1.js:4:10:10:3)
*** promise p2 REJECTED with value 19 at (PromiseChain1.js:4:10:10:3)
*** function f3 returned value undefined at (PromiseChain1.js:4:10:12:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (PromiseChain1.js:4:10:12:3)
** endExecution for unit-test
