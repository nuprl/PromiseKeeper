
SCRIPT ENTER (PromiseReturnArrCatch2.js:1:1:17:3) PromiseReturnArrCatch2_jalangi_.js PromiseReturnArrCatch2.js
*** call to Promise.resolve() at (PromiseReturnArrCatch2.js:3:10:3:28) creates promise p0
*** return from call to Promise.resolve() at (PromiseReturnArrCatch2.js:3:10:3:28) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 1 at (PromiseReturnArrCatch2.js:3:10:3:28)
*** call to Promise() constructor at (PromiseReturnArrCatch2.js:7:9:7:63) creates promise p1
*** promise p1 REJECTED with value [object Promise] at (PromiseReturnArrCatch2.js:7:49:7:60)
*** return from call to Promise() constructor at (PromiseReturnArrCatch2.js:7:9:7:63) associates OID obj7 with promise p1
*** resolve identity f1 registered at (PromiseReturnArrCatch2.js:8:10:14:3) on p1
*** reject identity f2 registered at (PromiseReturnArrCatch2.js:8:10:14:3) on p1
*** call to then() on promise p1 at (PromiseReturnArrCatch2.js:8:10:14:3) creates promise p2
*** resolve identity _default registered at (PromiseReturnArrCatch2.js:15:10:17:3) on p2
*** reject identity f3 registered at (PromiseReturnArrCatch2.js:15:10:17:3) on p2
*** call to catch() on promise p2 at (PromiseReturnArrCatch2.js:15:10:17:3) creates promise p3
SCRIPT EXIT (PromiseReturnArrCatch2.js:1:1:17:3)
*** function f2 threw value [object Promise] at (PromiseReturnArrCatch2.js:8:10:14:3)
*** promise p2 REJECTED with value [object Promise] at (PromiseReturnArrCatch2.js:8:10:14:3)
*** function f3 returned value undefined at (PromiseReturnArrCatch2.js:15:10:17:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (PromiseReturnArrCatch2.js:15:10:17:3)
** endExecution for unit-test
