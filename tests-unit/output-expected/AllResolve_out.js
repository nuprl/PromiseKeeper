
SCRIPT ENTER (AllResolve.js:1:1:12:4) AllResolve_jalangi_.js AllResolve.js
*** call to Promise.resolve() at (AllResolve.js:3:10:3:28) creates promise p0
*** return from call to Promise.resolve() at (AllResolve.js:3:10:3:28) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 3 at (AllResolve.js:3:10:3:28)
*** call to Promise() constructor at (AllResolve.js:5:10:7:3) creates promise p1
*** return from call to Promise() constructor at (AllResolve.js:5:10:7:3) associates OID obj5 with promise p1
*** call to Promise() constructor at (AllResolve.js:8:10:8:64) creates promise p2
*** promise p2 RESOLVED with value 17 at (AllResolve.js:8:50:8:61)
*** return from call to Promise() constructor at (AllResolve.js:8:10:8:64) associates OID obj7 with promise p2
*** call to all() on array [p0,1337,p1,p2] at (AllResolve.js:10:1:10:30) creates promise p3
*** resolve identity  registered at (AllResolve.js:10:1:12:3) on p3
*** reject identity _default registered at (AllResolve.js:10:1:12:3) on p3
*** call to then() on promise p3 at (AllResolve.js:10:1:12:3) creates promise p4
SCRIPT EXIT (AllResolve.js:1:1:12:4)
*** function  returned value foo at (AllResolve.js:6:5:6:37)
*** promise p1 RESOLVED with value foo at (AllResolve.js:6:5:6:37)
*** function  returned value undefined at (AllResolve.js:10:1:12:3)
*** promise p4 RESOLVED with implicitly returned value undefined at (AllResolve.js:10:1:12:3)
** endExecution for unit-test
