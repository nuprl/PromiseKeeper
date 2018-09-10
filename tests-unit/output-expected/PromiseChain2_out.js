
SCRIPT ENTER (PromiseChain2.js:1:1:12:4) PromiseChain2_jalangi_.js PromiseChain2.js
*** call to Promise() constructor at (PromiseChain2.js:3:9:3:63) creates promise p0
*** promise p0 RESOLVED with value 17 at (PromiseChain2.js:3:49:3:60)
*** return from call to Promise() constructor at (PromiseChain2.js:3:9:3:63) associates OID obj3 with promise p0
*** resolve identity f1 registered at (PromiseChain2.js:4:10:7:3) on p0
*** reject identity _default registered at (PromiseChain2.js:4:10:7:3) on p0
*** call to then() on promise p0 at (PromiseChain2.js:4:10:7:3) creates promise p1
*** resolve identity f2 registered at (PromiseChain2.js:4:10:10:3) on p1
*** reject identity _default registered at (PromiseChain2.js:4:10:10:3) on p1
*** call to then() on promise p1 at (PromiseChain2.js:4:10:10:3) creates promise p2
*** resolve identity _default registered at (PromiseChain2.js:4:10:12:3) on p2
*** reject identity f3 registered at (PromiseChain2.js:4:10:12:3) on p2
*** call to catch() on promise p2 at (PromiseChain2.js:4:10:12:3) creates promise p3
SCRIPT EXIT (PromiseChain2.js:1:1:12:4)
*** function f1 threw value 18 at (PromiseChain2.js:4:10:7:3)
*** promise p1 REJECTED with value 18 at (PromiseChain2.js:4:10:7:3)
*** function _default threw value 18 at (PromiseChain2.js:4:10:10:3)
*** promise p2 REJECTED with value 18 at (PromiseChain2.js:4:10:10:3)
*** function f3 returned value undefined at (PromiseChain2.js:4:10:12:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (PromiseChain2.js:4:10:12:3)
** endExecution for unit-test
