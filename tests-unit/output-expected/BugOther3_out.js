
SCRIPT ENTER (BugOther3.js:1:1:15:1) BugOther3_jalangi_.js BugOther3.js
*** call to Promise.reject() at (BugOther3.js:1:10:1:28) creates promise p0
*** return from call to Promise.reject() at (BugOther3.js:1:10:1:28) associates OID obj3 with promise p0
*** promise p0 REJECTED with value 42 at (BugOther3.js:1:10:1:28)
*** resolve identity _default registered at (BugOther3.js:8:10:8:24) on p0
*** reject identity _default registered at (BugOther3.js:8:10:8:24) on p0
*** call to catch() on promise p0 at (BugOther3.js:8:10:8:24) creates promise p1
*** resolve identity _default registered at (BugOther3.js:10:10:13:3) on p1
*** reject identity  registered at (BugOther3.js:10:10:13:3) on p1
*** call to catch() on promise p1 at (BugOther3.js:10:10:13:3) creates promise p2
SCRIPT EXIT (BugOther3.js:1:1:15:1)
*** function _default returned value 42 at (BugOther3.js:8:10:8:24)
*** promise p1 REJECTED with value 42 at (BugOther3.js:8:10:8:24)
*** function  returned value undefined at (BugOther3.js:10:10:13:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugOther3.js:10:10:13:3)
** endExecution for unit-test
