
SCRIPT ENTER (MissingExceptionalReject3.js:1:1:9:1) MissingExceptionalReject3_jalangi_.js MissingExceptionalReject3.js
*** call to Promise() constructor at (MissingExceptionalReject3.js:2:10:4:3) creates promise p0
*** promise p0 RESOLVED with value 42 at (MissingExceptionalReject3.js:3:5:3:16)
*** return from call to Promise() constructor at (MissingExceptionalReject3.js:2:10:4:3) associates OID obj3 with promise p0
*** resolve identity  registered at (MissingExceptionalReject3.js:5:1:7:3) on p0
*** reject identity _default registered at (MissingExceptionalReject3.js:5:1:7:3) on p0
*** call to then() on promise p0 at (MissingExceptionalReject3.js:5:1:7:3) creates promise p1
*** resolve identity  registered at (MissingExceptionalReject3.js:5:1:8:3) on p1
*** reject identity _default registered at (MissingExceptionalReject3.js:5:1:8:3) on p1
*** call to then() on promise p1 at (MissingExceptionalReject3.js:5:1:8:3) creates promise p2
SCRIPT EXIT (MissingExceptionalReject3.js:1:1:9:1)
*** function  threw value Error: unhandled error at (MissingExceptionalReject3.js:5:1:7:3)
*** promise p1 REJECTED with value Error: unhandled error at (MissingExceptionalReject3.js:5:1:7:3)
*** function _default threw value Error: unhandled error at (MissingExceptionalReject3.js:5:1:8:3)
*** promise p2 REJECTED with value Error: unhandled error at (MissingExceptionalReject3.js:5:1:8:3)
** endExecution for unit-test
