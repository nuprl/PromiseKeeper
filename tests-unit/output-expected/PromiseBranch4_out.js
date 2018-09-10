
SCRIPT ENTER (PromiseBranch4.js:1:1:20:4) PromiseBranch4_jalangi_.js PromiseBranch4.js
*** call to Promise.resolve() at (PromiseBranch4.js:15:1:15:18) creates promise p0
*** return from call to Promise.resolve() at (PromiseBranch4.js:15:1:15:18) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value undefined at (PromiseBranch4.js:15:1:15:18)
*** resolve identity  registered at (PromiseBranch4.js:15:1:17:3) on p0
*** reject identity _default registered at (PromiseBranch4.js:15:1:17:3) on p0
*** call to then() on promise p0 at (PromiseBranch4.js:15:1:17:3) creates promise p1
*** resolve identity  registered at (PromiseBranch4.js:15:1:20:3) on p1
*** reject identity _default registered at (PromiseBranch4.js:15:1:20:3) on p1
*** call to then() on promise p1 at (PromiseBranch4.js:15:1:20:3) creates promise p2
SCRIPT EXIT (PromiseBranch4.js:1:1:20:4)
*** call to Promise.resolve() at (PromiseBranch4.js:16:19:16:36) creates promise p3
*** return from call to Promise.resolve() at (PromiseBranch4.js:16:19:16:36) associates OID obj17 with promise p3
*** promise p3 RESOLVED with value undefined at (PromiseBranch4.js:16:19:16:36)
*** call to Proxy on promise p3 at (PromiseBranch4.js:10:17:10:47) creates promise p4
*** resolve identity  registered at (PromiseBranch4.js:12:12:12:34) on p4
*** reject identity _default registered at (PromiseBranch4.js:12:12:12:34) on p4
*** call to then() on promise p4 at (PromiseBranch4.js:12:12:12:34) creates promise p5
promise p1 LINKED with promise p5
*** call to Promise.resolve() at (PromiseBranch4.js:16:58:16:91) creates promise p6
*** return from call to Promise.resolve() at (PromiseBranch4.js:16:58:16:91) associates OID obj27 with promise p6
*** promise p6 RESOLVED with value targetResolved at (PromiseBranch4.js:16:58:16:91)
promise p5 LINKED with promise p6
*** function  returned value targetResolved at (PromiseBranch4.js:12:12:12:34)
*** promise p5 RESOLVED with explicitly returned value targetResolved linked from promise p6 at (PromiseBranch4.js:12:12:12:34)
*** function  returned value targetResolved at (PromiseBranch4.js:15:1:17:3)
*** promise p1 RESOLVED with explicitly returned value targetResolved linked from promise p5 at (PromiseBranch4.js:15:1:17:3)
*** function  returned value undefined at (PromiseBranch4.js:15:1:20:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (PromiseBranch4.js:15:1:20:3)
** endExecution for unit-test
