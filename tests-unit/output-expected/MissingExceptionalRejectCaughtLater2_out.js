
SCRIPT ENTER (MissingExceptionalRejectCaughtLater2.js:1:1:11:1) MissingExceptionalRejectCaughtLater2_jalangi_.js MissingExceptionalRejectCaughtLater2.js
*** call to Promise() constructor at (MissingExceptionalRejectCaughtLater2.js:2:10:4:3) creates promise p0
*** promise p0 RESOLVED with value 42 at (MissingExceptionalRejectCaughtLater2.js:3:5:3:16)
*** return from call to Promise() constructor at (MissingExceptionalRejectCaughtLater2.js:2:10:4:3) associates OID obj3 with promise p0
*** resolve identity  registered at (MissingExceptionalRejectCaughtLater2.js:5:1:7:3) on p0
*** reject identity _default registered at (MissingExceptionalRejectCaughtLater2.js:5:1:7:3) on p0
*** call to then() on promise p0 at (MissingExceptionalRejectCaughtLater2.js:5:1:7:3) creates promise p1
*** resolve identity  registered at (MissingExceptionalRejectCaughtLater2.js:5:1:8:3) on p1
*** reject identity _default registered at (MissingExceptionalRejectCaughtLater2.js:5:1:8:3) on p1
*** call to then() on promise p1 at (MissingExceptionalRejectCaughtLater2.js:5:1:8:3) creates promise p2
*** resolve identity _default registered at (MissingExceptionalRejectCaughtLater2.js:5:1:10:3) on p2
*** reject identity  registered at (MissingExceptionalRejectCaughtLater2.js:5:1:10:3) on p2
*** call to catch() on promise p2 at (MissingExceptionalRejectCaughtLater2.js:5:1:10:3) creates promise p3
SCRIPT EXIT (MissingExceptionalRejectCaughtLater2.js:1:1:11:1)
*** function  threw value Error: unhandled error at (MissingExceptionalRejectCaughtLater2.js:5:1:7:3)
*** promise p1 REJECTED with value Error: unhandled error at (MissingExceptionalRejectCaughtLater2.js:5:1:7:3)
*** function _default threw value Error: unhandled error at (MissingExceptionalRejectCaughtLater2.js:5:1:8:3)
*** promise p2 REJECTED with value Error: unhandled error at (MissingExceptionalRejectCaughtLater2.js:5:1:8:3)
*** function  returned value undefined at (MissingExceptionalRejectCaughtLater2.js:5:1:10:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (MissingExceptionalRejectCaughtLater2.js:5:1:10:3)
** endExecution for unit-test
