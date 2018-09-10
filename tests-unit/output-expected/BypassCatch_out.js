
SCRIPT ENTER (BypassCatch.js:1:1:10:4) BypassCatch_jalangi_.js BypassCatch.js
*** call to Promise.resolve() at (BypassCatch.js:3:10:3:29) creates promise p0
*** return from call to Promise.resolve() at (BypassCatch.js:3:10:3:29) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 17 at (BypassCatch.js:3:10:3:29)
*** resolve identity _default registered at (BypassCatch.js:4:1:7:3) on p0
*** reject identity  registered at (BypassCatch.js:4:1:7:3) on p0
*** call to catch() on promise p0 at (BypassCatch.js:4:1:7:3) creates promise p1
*** resolve identity  registered at (BypassCatch.js:4:1:10:3) on p1
*** reject identity _default registered at (BypassCatch.js:4:1:10:3) on p1
*** call to then() on promise p1 at (BypassCatch.js:4:1:10:3) creates promise p2
SCRIPT EXIT (BypassCatch.js:1:1:10:4)
*** function _default returned value 17 at (BypassCatch.js:4:1:7:3)
*** promise p1 RESOLVED with value 17 at (BypassCatch.js:4:1:7:3)
*** function  returned value 88 at (BypassCatch.js:4:1:10:3)
*** promise p2 RESOLVED with explicitly returned value 88 at (BypassCatch.js:4:1:10:3)
** endExecution for unit-test
