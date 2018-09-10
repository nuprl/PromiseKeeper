
SCRIPT ENTER (PromiseChain6.js:1:1:17:3) PromiseChain6_jalangi_.js PromiseChain6.js
*** call to Promise.resolve() at (PromiseChain6.js:3:9:3:28) creates promise p0
*** return from call to Promise.resolve() at (PromiseChain6.js:3:9:3:28) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 17 at (PromiseChain6.js:3:9:3:28)
*** resolve identity f1 registered at (PromiseChain6.js:4:1:6:3) on p0
*** reject identity _default registered at (PromiseChain6.js:4:1:6:3) on p0
*** call to then() on promise p0 at (PromiseChain6.js:4:1:6:3) creates promise p1
*** resolve identity f2 registered at (PromiseChain6.js:4:1:8:3) on p1
*** reject identity _default registered at (PromiseChain6.js:4:1:8:3) on p1
*** call to then() on promise p1 at (PromiseChain6.js:4:1:8:3) creates promise p2
*** resolve identity f3 registered at (PromiseChain6.js:4:1:10:3) on p2
*** reject identity _default registered at (PromiseChain6.js:4:1:10:3) on p2
*** call to then() on promise p2 at (PromiseChain6.js:4:1:10:3) creates promise p3
*** resolve identity f4 registered at (PromiseChain6.js:4:1:12:3) on p3
*** reject identity _default registered at (PromiseChain6.js:4:1:12:3) on p3
*** call to then() on promise p3 at (PromiseChain6.js:4:1:12:3) creates promise p4
*** resolve identity f5 registered at (PromiseChain6.js:4:1:14:3) on p4
*** reject identity _default registered at (PromiseChain6.js:4:1:14:3) on p4
*** call to then() on promise p4 at (PromiseChain6.js:4:1:14:3) creates promise p5
*** resolve identity _default registered at (PromiseChain6.js:4:1:17:3) on p5
*** reject identity f6 registered at (PromiseChain6.js:4:1:17:3) on p5
*** call to catch() on promise p5 at (PromiseChain6.js:4:1:17:3) creates promise p6
SCRIPT EXIT (PromiseChain6.js:1:1:17:3)
*** function f1 threw value 77 at (PromiseChain6.js:4:1:6:3)
*** promise p1 REJECTED with value 77 at (PromiseChain6.js:4:1:6:3)
*** function _default threw value 77 at (PromiseChain6.js:4:1:8:3)
*** promise p2 REJECTED with value 77 at (PromiseChain6.js:4:1:8:3)
*** function _default threw value 77 at (PromiseChain6.js:4:1:10:3)
*** promise p3 REJECTED with value 77 at (PromiseChain6.js:4:1:10:3)
*** function _default threw value 77 at (PromiseChain6.js:4:1:12:3)
*** promise p4 REJECTED with value 77 at (PromiseChain6.js:4:1:12:3)
*** function _default threw value 77 at (PromiseChain6.js:4:1:14:3)
*** promise p5 REJECTED with value 77 at (PromiseChain6.js:4:1:14:3)
*** function f6 returned value 77 at (PromiseChain6.js:4:1:17:3)
*** promise p6 RESOLVED with explicitly returned value 77 at (PromiseChain6.js:4:1:17:3)
** endExecution for unit-test
