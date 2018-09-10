
SCRIPT ENTER (BugDoubleSettle1.js:1:1:17:1) BugDoubleSettle1_jalangi_.js BugDoubleSettle1.js
*** call to Promise() constructor at (BugDoubleSettle1.js:4:10:7:3) creates promise p0
*** return from call to Promise() constructor at (BugDoubleSettle1.js:4:10:7:3) associates OID obj3 with promise p0
*** resolve identity  registered at (BugDoubleSettle1.js:9:10:12:3) on p0
*** reject identity _default registered at (BugDoubleSettle1.js:9:10:12:3) on p0
*** call to then() on promise p0 at (BugDoubleSettle1.js:9:10:12:3) creates promise p1
*** promise p0 RESOLVED with value 42 at (BugDoubleSettle1.js:14:1:14:12)
*** attempt to resolve settled promise p0 with value 82 at (BugDoubleSettle1.js:15:1:15:12)
SCRIPT EXIT (BugDoubleSettle1.js:1:1:17:1)
*** function  returned value undefined at (BugDoubleSettle1.js:9:10:12:3)
*** promise p1 RESOLVED with implicitly returned value undefined at (BugDoubleSettle1.js:9:10:12:3)
** endExecution for unit-test
