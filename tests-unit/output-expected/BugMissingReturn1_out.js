
SCRIPT ENTER (BugMissingReturn1.js:1:1:13:1) BugMissingReturn1_jalangi_.js BugMissingReturn1.js
*** call to Promise.resolve() at (BugMissingReturn1.js:2:10:2:29) creates promise p0
*** return from call to Promise.resolve() at (BugMissingReturn1.js:2:10:2:29) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 42 at (BugMissingReturn1.js:2:10:2:29)
*** resolve identity  registered at (BugMissingReturn1.js:4:10:7:3) on p0
*** reject identity _default registered at (BugMissingReturn1.js:4:10:7:3) on p0
*** call to then() on promise p0 at (BugMissingReturn1.js:4:10:7:3) creates promise p1
*** resolve identity  registered at (BugMissingReturn1.js:9:10:12:3) on p1
*** reject identity _default registered at (BugMissingReturn1.js:9:10:12:3) on p1
*** call to then() on promise p1 at (BugMissingReturn1.js:9:10:12:3) creates promise p2
SCRIPT EXIT (BugMissingReturn1.js:1:1:13:1)
*** function  returned value undefined at (BugMissingReturn1.js:4:10:7:3)
*** promise p1 RESOLVED with implicitly returned value undefined at (BugMissingReturn1.js:4:10:7:3)
*** function  returned value undefined at (BugMissingReturn1.js:9:10:12:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugMissingReturn1.js:9:10:12:3)
** endExecution for unit-test
