
SCRIPT ENTER (BugMissingReturn2.js:1:1:17:1) BugMissingReturn2_jalangi_.js BugMissingReturn2.js
*** call to Promise.reject() at (BugMissingReturn2.js:2:10:2:28) creates promise p0
*** return from call to Promise.reject() at (BugMissingReturn2.js:2:10:2:28) associates OID obj3 with promise p0
*** promise p0 REJECTED with value 42 at (BugMissingReturn2.js:2:10:2:28)
*** resolve identity  registered at (BugMissingReturn2.js:4:10:11:3) on p0
*** reject identity  registered at (BugMissingReturn2.js:4:10:11:3) on p0
*** call to then() on promise p0 at (BugMissingReturn2.js:4:10:11:3) creates promise p1
*** resolve identity  registered at (BugMissingReturn2.js:13:10:16:3) on p1
*** reject identity _default registered at (BugMissingReturn2.js:13:10:16:3) on p1
*** call to then() on promise p1 at (BugMissingReturn2.js:13:10:16:3) creates promise p2
SCRIPT EXIT (BugMissingReturn2.js:1:1:17:1)
*** function  returned value undefined at (BugMissingReturn2.js:4:10:11:3)
*** promise p1 RESOLVED with implicitly returned value undefined at (BugMissingReturn2.js:4:10:11:3)
*** function  returned value undefined at (BugMissingReturn2.js:13:10:16:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugMissingReturn2.js:13:10:16:3)
** endExecution for unit-test
