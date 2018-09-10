
SCRIPT ENTER (NewPromiseRejectTwoArgThenCatch.js:1:1:13:3) NewPromiseRejectTwoArgThenCatch_jalangi_.js NewPromiseRejectTwoArgThenCatch.js
*** call to Promise() constructor at (NewPromiseRejectTwoArgThenCatch.js:3:9:3:62) creates promise p0
*** promise p0 REJECTED with value 42 at (NewPromiseRejectTwoArgThenCatch.js:3:49:3:59)
*** return from call to Promise() constructor at (NewPromiseRejectTwoArgThenCatch.js:3:9:3:62) associates OID obj3 with promise p0
*** resolve identity f1 registered at (NewPromiseRejectTwoArgThenCatch.js:4:10:10:3) on p0
*** reject identity f2 registered at (NewPromiseRejectTwoArgThenCatch.js:4:10:10:3) on p0
*** call to then() on promise p0 at (NewPromiseRejectTwoArgThenCatch.js:4:10:10:3) creates promise p1
*** resolve identity _default registered at (NewPromiseRejectTwoArgThenCatch.js:11:10:13:3) on p1
*** reject identity f3 registered at (NewPromiseRejectTwoArgThenCatch.js:11:10:13:3) on p1
*** call to catch() on promise p1 at (NewPromiseRejectTwoArgThenCatch.js:11:10:13:3) creates promise p2
SCRIPT EXIT (NewPromiseRejectTwoArgThenCatch.js:1:1:13:3)
*** function f2 threw value 17 at (NewPromiseRejectTwoArgThenCatch.js:4:10:10:3)
*** promise p1 REJECTED with value 17 at (NewPromiseRejectTwoArgThenCatch.js:4:10:10:3)
*** function f3 returned value undefined at (NewPromiseRejectTwoArgThenCatch.js:11:10:13:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (NewPromiseRejectTwoArgThenCatch.js:11:10:13:3)
** endExecution for unit-test
