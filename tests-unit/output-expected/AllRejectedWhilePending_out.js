
SCRIPT ENTER (AllRejectedWhilePending.js:1:1:10:4) AllRejectedWhilePending_jalangi_.js AllRejectedWhilePending.js
*** call to Promise.reject() at (AllRejectedWhilePending.js:1:10:1:44) creates promise p0
*** return from call to Promise.reject() at (AllRejectedWhilePending.js:1:10:1:44) associates OID obj3 with promise p0
*** promise p0 REJECTED with value immediate reject at (AllRejectedWhilePending.js:1:10:1:44)
*** call to Promise() constructor at (AllRejectedWhilePending.js:3:10:3:50) creates promise p1
*** return from call to Promise() constructor at (AllRejectedWhilePending.js:3:10:3:50) associates OID obj5 with promise p1
*** call to Promise() constructor at (AllRejectedWhilePending.js:4:10:4:64) creates promise p2
*** promise p2 RESOLVED with value 17 at (AllRejectedWhilePending.js:4:50:4:61)
*** return from call to Promise() constructor at (AllRejectedWhilePending.js:4:10:4:64) associates OID obj7 with promise p2
*** call to all() on array [p0,1337,p1,p2] at (AllRejectedWhilePending.js:6:1:6:30) creates promise p3
*** resolve identity  registered at (AllRejectedWhilePending.js:6:1:8:3) on p3
*** reject identity _default registered at (AllRejectedWhilePending.js:6:1:8:3) on p3
*** call to then() on promise p3 at (AllRejectedWhilePending.js:6:1:8:3) creates promise p4
*** resolve identity _default registered at (AllRejectedWhilePending.js:6:1:10:3) on p4
*** reject identity  registered at (AllRejectedWhilePending.js:6:1:10:3) on p4
*** call to catch() on promise p4 at (AllRejectedWhilePending.js:6:1:10:3) creates promise p5
SCRIPT EXIT (AllRejectedWhilePending.js:1:1:10:4)
*** function _default returned value immediate reject at (AllRejectedWhilePending.js:6:1:8:3)
*** promise p4 REJECTED with value immediate reject at (AllRejectedWhilePending.js:6:1:8:3)
*** function  returned value undefined at (AllRejectedWhilePending.js:6:1:10:3)
*** promise p5 RESOLVED with implicitly returned value undefined at (AllRejectedWhilePending.js:6:1:10:3)
** endExecution for unit-test
