
SCRIPT ENTER (PromisesInLoop2.js:1:1:13:2) PromisesInLoop2_jalangi_.js PromisesInLoop2.js
*** call to Promise.resolve() at (PromisesInLoop2.js:12:12:12:30) creates promise p0
*** return from call to Promise.resolve() at (PromisesInLoop2.js:12:12:12:30) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 1 at (PromisesInLoop2.js:12:12:12:30)
*** resolve identity  registered at (PromisesInLoop2.js:2:12:4:7) on p0
*** reject identity _default registered at (PromisesInLoop2.js:2:12:4:7) on p0
*** call to then() on promise p0 at (PromisesInLoop2.js:2:12:4:7) creates promise p1
*** resolve identity  registered at (PromisesInLoop2.js:2:12:6:7) on p1
*** reject identity _default registered at (PromisesInLoop2.js:2:12:6:7) on p1
*** call to then() on promise p1 at (PromisesInLoop2.js:2:12:6:7) creates promise p2
*** resolve identity _default registered at (PromisesInLoop2.js:2:12:8:7) on p2
*** reject identity  registered at (PromisesInLoop2.js:2:12:8:7) on p2
*** call to catch() on promise p2 at (PromisesInLoop2.js:2:12:8:7) creates promise p3
*** call to Promise.resolve() at (PromisesInLoop2.js:12:12:12:30) creates promise p4
*** return from call to Promise.resolve() at (PromisesInLoop2.js:12:12:12:30) associates OID obj23 with promise p4
*** promise p4 RESOLVED with value 2 at (PromisesInLoop2.js:12:12:12:30)
*** resolve identity  registered at (PromisesInLoop2.js:2:12:4:7) on p4
*** reject identity _default registered at (PromisesInLoop2.js:2:12:4:7) on p4
*** call to then() on promise p4 at (PromisesInLoop2.js:2:12:4:7) creates promise p5
*** resolve identity  registered at (PromisesInLoop2.js:2:12:6:7) on p5
*** reject identity _default registered at (PromisesInLoop2.js:2:12:6:7) on p5
*** call to then() on promise p5 at (PromisesInLoop2.js:2:12:6:7) creates promise p6
*** resolve identity _default registered at (PromisesInLoop2.js:2:12:8:7) on p6
*** reject identity  registered at (PromisesInLoop2.js:2:12:8:7) on p6
*** call to catch() on promise p6 at (PromisesInLoop2.js:2:12:8:7) creates promise p7
SCRIPT EXIT (PromisesInLoop2.js:1:1:13:2)
*** function  returned value 1 at (PromisesInLoop2.js:2:12:4:7)
*** promise p1 RESOLVED with explicitly returned value 1 at (PromisesInLoop2.js:2:12:4:7)
*** function  returned value 2 at (PromisesInLoop2.js:2:12:4:7)
*** promise p5 RESOLVED with explicitly returned value 2 at (PromisesInLoop2.js:2:12:4:7)
*** function  returned value undefined at (PromisesInLoop2.js:2:12:6:7)
*** promise p2 RESOLVED with implicitly returned value undefined at (PromisesInLoop2.js:2:12:6:7)
*** function  returned value undefined at (PromisesInLoop2.js:2:12:6:7)
*** promise p6 RESOLVED with implicitly returned value undefined at (PromisesInLoop2.js:2:12:6:7)
*** function _default returned value undefined at (PromisesInLoop2.js:2:12:8:7)
*** promise p3 RESOLVED with implicitly returned value undefined at (PromisesInLoop2.js:2:12:8:7)
*** function _default returned value undefined at (PromisesInLoop2.js:2:12:8:7)
*** promise p7 RESOLVED with implicitly returned value undefined at (PromisesInLoop2.js:2:12:8:7)
** endExecution for unit-test
