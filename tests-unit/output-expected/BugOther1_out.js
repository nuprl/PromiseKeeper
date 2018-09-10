
SCRIPT ENTER (BugOther1.js:1:1:15:1) BugOther1_jalangi_.js BugOther1.js
*** call to Promise.resolve() at (BugOther1.js:1:10:1:29) creates promise p0
*** return from call to Promise.resolve() at (BugOther1.js:1:10:1:29) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 42 at (BugOther1.js:1:10:1:29)
*** resolve identity _default registered at (BugOther1.js:8:10:8:23) on p0
*** reject identity _default registered at (BugOther1.js:8:10:8:23) on p0
*** call to then() on promise p0 at (BugOther1.js:8:10:8:23) creates promise p1
*** resolve identity  registered at (BugOther1.js:10:10:13:3) on p1
*** reject identity _default registered at (BugOther1.js:10:10:13:3) on p1
*** call to then() on promise p1 at (BugOther1.js:10:10:13:3) creates promise p2
SCRIPT EXIT (BugOther1.js:1:1:15:1)
*** function _default returned value 42 at (BugOther1.js:8:10:8:23)
*** promise p1 RESOLVED with explicitly returned value 42 at (BugOther1.js:8:10:8:23)
*** function  returned value undefined at (BugOther1.js:10:10:13:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugOther1.js:10:10:13:3)
** endExecution for unit-test
