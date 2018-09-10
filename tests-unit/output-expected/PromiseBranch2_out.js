
SCRIPT ENTER (PromiseBranch2.js:1:1:35:1) PromiseBranch2_jalangi_.js PromiseBranch2.js
*** call to Promise.resolve() at (PromiseBranch2.js:27:12:27:29) creates promise p0
*** return from call to Promise.resolve() at (PromiseBranch2.js:27:12:27:29) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value undefined at (PromiseBranch2.js:27:12:27:29)
*** resolve identity  registered at (PromiseBranch2.js:23:12:23:45) on p0
*** reject identity  registered at (PromiseBranch2.js:23:12:23:45) on p0
*** call to then() on promise p0 at (PromiseBranch2.js:23:12:23:45) creates promise p1
*** resolve identity  registered at (PromiseBranch2.js:26:1:34:3) on p1
*** reject identity _default registered at (PromiseBranch2.js:26:1:34:3) on p1
*** call to then() on promise p1 at (PromiseBranch2.js:26:1:34:3) creates promise p2
SCRIPT EXIT (PromiseBranch2.js:1:1:35:1)
*** call to Promise.resolve() at (PromiseBranch2.js:29:12:29:45) creates promise p3
*** return from call to Promise.resolve() at (PromiseBranch2.js:29:12:29:45) associates OID obj17 with promise p3
*** promise p3 RESOLVED with value targetResolved at (PromiseBranch2.js:29:12:29:45)
promise p1 LINKED with promise p3
*** function  returned value targetResolved at (PromiseBranch2.js:23:12:23:45)
*** promise p1 RESOLVED with explicitly returned value targetResolved linked from promise p3 at (PromiseBranch2.js:23:12:23:45)
*** function  returned value undefined at (PromiseBranch2.js:26:1:34:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (PromiseBranch2.js:26:1:34:3)
** endExecution for unit-test
