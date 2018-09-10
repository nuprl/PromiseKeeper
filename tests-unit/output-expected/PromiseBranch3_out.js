
SCRIPT ENTER (PromiseBranch3.js:1:1:30:1) PromiseBranch3_jalangi_.js PromiseBranch3.js
*** call to Promise.resolve() at (PromiseBranch3.js:21:1:21:18) creates promise p0
*** return from call to Promise.resolve() at (PromiseBranch3.js:21:1:21:18) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value undefined at (PromiseBranch3.js:21:1:21:18)
*** resolve identity  registered at (PromiseBranch3.js:21:1:27:3) on p0
*** reject identity _default registered at (PromiseBranch3.js:21:1:27:3) on p0
*** call to then() on promise p0 at (PromiseBranch3.js:21:1:27:3) creates promise p1
*** resolve identity  registered at (PromiseBranch3.js:21:1:29:3) on p1
*** reject identity _default registered at (PromiseBranch3.js:21:1:29:3) on p1
*** call to then() on promise p1 at (PromiseBranch3.js:21:1:29:3) creates promise p2
SCRIPT EXIT (PromiseBranch3.js:1:1:30:1)
*** call to Promise.resolve() at (PromiseBranch3.js:22:19:22:36) creates promise p3
*** return from call to Promise.resolve() at (PromiseBranch3.js:22:19:22:36) associates OID obj17 with promise p3
*** promise p3 RESOLVED with value undefined at (PromiseBranch3.js:22:19:22:36)
*** call to Proxy on promise p3 at (PromiseBranch3.js:15:17:15:47) creates promise p4
*** resolve identity  registered at (PromiseBranch3.js:18:12:18:45) on p4
*** reject identity  registered at (PromiseBranch3.js:18:12:18:45) on p4
*** call to then() on promise p4 at (PromiseBranch3.js:18:12:18:45) creates promise p5
promise p1 LINKED with promise p5
*** call to Promise.resolve() at (PromiseBranch3.js:23:16:23:49) creates promise p6
*** return from call to Promise.resolve() at (PromiseBranch3.js:23:16:23:49) associates OID obj27 with promise p6
*** promise p6 RESOLVED with value targetResolved at (PromiseBranch3.js:23:16:23:49)
promise p5 LINKED with promise p6
*** function  returned value targetResolved at (PromiseBranch3.js:18:12:18:45)
*** promise p5 RESOLVED with explicitly returned value targetResolved linked from promise p6 at (PromiseBranch3.js:18:12:18:45)
*** function  returned value targetResolved at (PromiseBranch3.js:21:1:27:3)
*** promise p1 RESOLVED with explicitly returned value targetResolved linked from promise p5 at (PromiseBranch3.js:21:1:27:3)
*** function  returned value undefined at (PromiseBranch3.js:21:1:29:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (PromiseBranch3.js:21:1:29:3)
** endExecution for unit-test
