
SCRIPT ENTER (BugOther2.js:1:1:14:1) BugOther2_jalangi_.js BugOther2.js
*** call to Promise.reject() at (BugOther2.js:1:10:1:28) creates promise p0
*** return from call to Promise.reject() at (BugOther2.js:1:10:1:28) associates OID obj3 with promise p0
*** promise p0 REJECTED with value 42 at (BugOther2.js:1:10:1:28)
*** resolve identity _default registered at (BugOther2.js:8:10:8:23) on p0
*** reject identity _default registered at (BugOther2.js:8:10:8:23) on p0
*** call to then() on promise p0 at (BugOther2.js:8:10:8:23) creates promise p1
*** resolve identity _default registered at (BugOther2.js:10:10:12:3) on p1
*** reject identity  registered at (BugOther2.js:10:10:12:3) on p1
*** call to catch() on promise p1 at (BugOther2.js:10:10:12:3) creates promise p2
SCRIPT EXIT (BugOther2.js:1:1:14:1)
*** function _default returned value 42 at (BugOther2.js:8:10:8:23)
*** promise p1 REJECTED with value 42 at (BugOther2.js:8:10:8:23)
*** function  returned value undefined at (BugOther2.js:10:10:12:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugOther2.js:10:10:12:3)
** endExecution for unit-test
