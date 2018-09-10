
SCRIPT ENTER (BugOther4.js:1:1:11:1) BugOther4_jalangi_.js BugOther4.js
*** call to Promise.reject() at (BugOther4.js:1:10:1:28) creates promise p0
*** return from call to Promise.reject() at (BugOther4.js:1:10:1:28) associates OID obj3 with promise p0
*** promise p0 REJECTED with value 42 at (BugOther4.js:1:10:1:28)
*** resolve identity _default registered at (BugOther4.js:4:10:4:25) on p0
*** reject identity _default registered at (BugOther4.js:4:10:4:25) on p0
*** call to then() on promise p0 at (BugOther4.js:4:10:4:25) creates promise p1
*** resolve identity _default registered at (BugOther4.js:6:10:9:3) on p1
*** reject identity  registered at (BugOther4.js:6:10:9:3) on p1
*** call to catch() on promise p1 at (BugOther4.js:6:10:9:3) creates promise p2
SCRIPT EXIT (BugOther4.js:1:1:11:1)
*** function _default returned value 42 at (BugOther4.js:4:10:4:25)
*** promise p1 REJECTED with value 42 at (BugOther4.js:4:10:4:25)
*** function  returned value undefined at (BugOther4.js:6:10:9:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BugOther4.js:6:10:9:3)
** endExecution for unit-test
