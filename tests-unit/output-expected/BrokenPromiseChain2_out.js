
SCRIPT ENTER (BrokenPromiseChain2.js:1:1:20:2) BrokenPromiseChain2_jalangi_.js BrokenPromiseChain2.js
*** call to Promise() constructor at (BrokenPromiseChain2.js:13:12:15:7) creates promise p0
*** promise p0 RESOLVED with value 1 at (BrokenPromiseChain2.js:14:9:14:19)
*** return from call to Promise() constructor at (BrokenPromiseChain2.js:13:12:15:7) associates OID obj3 with promise p0
*** resolve identity  registered at (BrokenPromiseChain2.js:1:1:4:7) on p0
*** reject identity _default registered at (BrokenPromiseChain2.js:1:1:4:7) on p0
*** call to then() on promise p0 at (BrokenPromiseChain2.js:1:1:4:7) creates promise p1
*** resolve identity  registered at (BrokenPromiseChain2.js:1:1:7:7) on p1
*** reject identity _default registered at (BrokenPromiseChain2.js:1:1:7:7) on p1
*** call to then() on promise p1 at (BrokenPromiseChain2.js:1:1:7:7) creates promise p2
*** resolve identity _default registered at (BrokenPromiseChain2.js:1:1:10:7) on p2
*** reject identity  registered at (BrokenPromiseChain2.js:1:1:10:7) on p2
*** call to catch() on promise p2 at (BrokenPromiseChain2.js:1:1:10:7) creates promise p3
SCRIPT EXIT (BrokenPromiseChain2.js:1:1:20:2)
*** function  returned value undefined at (BrokenPromiseChain2.js:1:1:4:7)
*** promise p1 RESOLVED with implicitly returned value undefined at (BrokenPromiseChain2.js:1:1:4:7)
*** function  returned value undefined at (BrokenPromiseChain2.js:1:1:7:7)
*** promise p2 RESOLVED with implicitly returned value undefined at (BrokenPromiseChain2.js:1:1:7:7)
*** function _default returned value undefined at (BrokenPromiseChain2.js:1:1:10:7)
*** promise p3 RESOLVED with implicitly returned value undefined at (BrokenPromiseChain2.js:1:1:10:7)
** endExecution for unit-test
