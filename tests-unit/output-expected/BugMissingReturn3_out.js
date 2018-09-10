
SCRIPT ENTER (BugMissingReturn3.js:1:1:18:1) BugMissingReturn3_jalangi_.js BugMissingReturn3.js
*** call to Promise.resolve() at (BugMissingReturn3.js:2:10:2:36) creates promise p0
*** return from call to Promise.resolve() at (BugMissingReturn3.js:2:10:2:36) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 1,2,3 at (BugMissingReturn3.js:2:10:2:36)
*** resolve identity  registered at (BugMissingReturn3.js:8:10:12:3) on p0
*** reject identity _default registered at (BugMissingReturn3.js:8:10:12:3) on p0
*** call to then() on promise p0 at (BugMissingReturn3.js:8:10:12:3) creates promise p1
*** resolve identity  registered at (BugMissingReturn3.js:14:10:17:3) on p1
*** reject identity _default registered at (BugMissingReturn3.js:14:10:17:3) on p1
*** call to then() on promise p1 at (BugMissingReturn3.js:14:10:17:3) creates promise p2
SCRIPT EXIT (BugMissingReturn3.js:1:1:18:1)
*** function  returned value undefined at (BugMissingReturn3.js:8:10:12:3)
*** promise p1 RESOLVED with explicitly returned value undefined at (BugMissingReturn3.js:8:10:12:3)
*** function  returned value undefined at (BugMissingReturn3.js:14:10:17:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugMissingReturn3.js:14:10:17:3)
** endExecution for unit-test
