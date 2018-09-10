
SCRIPT ENTER (MultipleThensError1.js:1:1:7:4) MultipleThensError1_jalangi_.js MultipleThensError1.js
*** call to Promise.resolve() at (MultipleThensError1.js:1:9:1:26) creates promise p0
*** return from call to Promise.resolve() at (MultipleThensError1.js:1:9:1:26) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value undefined at (MultipleThensError1.js:1:9:1:26)
*** resolve identity  registered at (MultipleThensError1.js:2:1:4:3) on p0
*** reject identity _default registered at (MultipleThensError1.js:2:1:4:3) on p0
*** call to then() on promise p0 at (MultipleThensError1.js:2:1:4:3) creates promise p1
*** resolve identity  registered at (MultipleThensError1.js:5:1:7:3) on p0
*** reject identity _default registered at (MultipleThensError1.js:5:1:7:3) on p0
*** call to then() on promise p0 at (MultipleThensError1.js:5:1:7:3) creates promise p2
SCRIPT EXIT (MultipleThensError1.js:1:1:7:4)
*** function  threw value Error: whoops! at (MultipleThensError1.js:2:1:4:3)
*** promise p1 REJECTED with value Error: whoops! at (MultipleThensError1.js:2:1:4:3)
*** function  returned value undefined at (MultipleThensError1.js:5:1:7:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (MultipleThensError1.js:5:1:7:3)
** endExecution for unit-test
