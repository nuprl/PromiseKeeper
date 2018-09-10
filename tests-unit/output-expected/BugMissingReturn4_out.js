
SCRIPT ENTER (BugMissingReturn4.js:1:1:21:1) BugMissingReturn4_jalangi_.js BugMissingReturn4.js
*** call to Promise.resolve() at (BugMissingReturn4.js:2:10:2:36) creates promise p0
*** return from call to Promise.resolve() at (BugMissingReturn4.js:2:10:2:36) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 1,2,3 at (BugMissingReturn4.js:2:10:2:36)
*** resolve identity  registered at (BugMissingReturn4.js:4:10:15:3) on p0
*** reject identity _default registered at (BugMissingReturn4.js:4:10:15:3) on p0
*** call to then() on promise p0 at (BugMissingReturn4.js:4:10:15:3) creates promise p1
*** resolve identity  registered at (BugMissingReturn4.js:17:10:20:3) on p1
*** reject identity _default registered at (BugMissingReturn4.js:17:10:20:3) on p1
*** call to then() on promise p1 at (BugMissingReturn4.js:17:10:20:3) creates promise p2
SCRIPT EXIT (BugMissingReturn4.js:1:1:21:1)
*** function  returned value undefined at (BugMissingReturn4.js:4:10:15:3)
*** promise p1 RESOLVED with implicitly returned value undefined at (BugMissingReturn4.js:4:10:15:3)
*** function  returned value undefined at (BugMissingReturn4.js:17:10:20:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugMissingReturn4.js:17:10:20:3)
** endExecution for unit-test
