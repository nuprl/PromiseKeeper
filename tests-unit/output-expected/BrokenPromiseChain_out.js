
SCRIPT ENTER (BrokenPromiseChain.js:1:1:14:1) BrokenPromiseChain_jalangi_.js BrokenPromiseChain.js
*** call to Promise() constructor at (BrokenPromiseChain.js:2:13:4:7) creates promise p0
*** return from call to Promise() constructor at (BrokenPromiseChain.js:2:13:4:7) associates OID obj3 with promise p0
*** resolve identity  registered at (BrokenPromiseChain.js:5:5:7:7) on p0
*** reject identity _default registered at (BrokenPromiseChain.js:5:5:7:7) on p0
*** call to then() on promise p0 at (BrokenPromiseChain.js:5:5:7:7) creates promise p1
*** resolve identity  registered at (BrokenPromiseChain.js:11:1:13:3) on p0
*** reject identity _default registered at (BrokenPromiseChain.js:11:1:13:3) on p0
*** call to then() on promise p0 at (BrokenPromiseChain.js:11:1:13:3) creates promise p2
SCRIPT EXIT (BrokenPromiseChain.js:1:1:14:1)
*** function  returned value undefined at (BrokenPromiseChain.js:3:9:3:33)
*** promise p0 RESOLVED with value undefined at (BrokenPromiseChain.js:3:9:3:33)
*** function  returned value hello at (BrokenPromiseChain.js:5:5:7:7)
*** promise p1 RESOLVED with explicitly returned value hello at (BrokenPromiseChain.js:5:5:7:7)
*** function  returned value undefined at (BrokenPromiseChain.js:11:1:13:3)
*** promise p2 RESOLVED with implicitly returned value undefined at (BrokenPromiseChain.js:11:1:13:3)
** endExecution for unit-test
