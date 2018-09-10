
SCRIPT ENTER (PromiseBranch.js:1:1:28:1) PromiseBranch_jalangi_.js PromiseBranch.js
*** call to Promise.resolve() at (PromiseBranch.js:21:8:21:25) creates promise p0
*** return from call to Promise.resolve() at (PromiseBranch.js:21:8:21:25) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value undefined at (PromiseBranch.js:21:8:21:25)
*** call to Proxy on promise p0 at (PromiseBranch.js:15:17:15:47) creates promise p1
*** resolve identity  registered at (PromiseBranch.js:18:12:18:45) on p1
*** reject identity  registered at (PromiseBranch.js:18:12:18:45) on p1
*** call to then() on promise p1 at (PromiseBranch.js:18:12:18:45) creates promise p2
*** resolve identity  registered at (PromiseBranch.js:21:1:27:3) on p2
*** reject identity _default registered at (PromiseBranch.js:21:1:27:3) on p2
*** call to then() on promise p2 at (PromiseBranch.js:21:1:27:3) creates promise p3
SCRIPT EXIT (PromiseBranch.js:1:1:28:1)
*** call to Promise.resolve() at (PromiseBranch.js:22:12:22:45) creates promise p4
*** return from call to Promise.resolve() at (PromiseBranch.js:22:12:22:45) associates OID obj19 with promise p4
*** promise p4 RESOLVED with value targetResolved at (PromiseBranch.js:22:12:22:45)
promise p2 LINKED with promise p4
*** function  returned value targetResolved at (PromiseBranch.js:18:12:18:45)
*** promise p2 RESOLVED with explicitly returned value targetResolved linked from promise p4 at (PromiseBranch.js:18:12:18:45)
*** function  returned value undefined at (PromiseBranch.js:21:1:27:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (PromiseBranch.js:21:1:27:3)
** endExecution for unit-test
