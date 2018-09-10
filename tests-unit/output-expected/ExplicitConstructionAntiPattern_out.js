
SCRIPT ENTER (ExplicitConstructionAntiPattern.js:1:1:27:2) ExplicitConstructionAntiPattern_jalangi_.js ExplicitConstructionAntiPattern.js
*** call to Promise.resolve() at (ExplicitConstructionAntiPattern.js:4:27:4:45) creates promise p0
*** return from call to Promise.resolve() at (ExplicitConstructionAntiPattern.js:4:27:4:45) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value 1 at (ExplicitConstructionAntiPattern.js:4:27:4:45)
*** call to Promise() constructor at (ExplicitConstructionAntiPattern.js:6:24:9:22) creates promise p1
*** return from call to Promise() constructor at (ExplicitConstructionAntiPattern.js:6:24:9:22) associates OID obj5 with promise p1
*** resolve identity  registered at (ExplicitConstructionAntiPattern.js:11:9:16:11) on p0
*** reject identity _default registered at (ExplicitConstructionAntiPattern.js:11:9:16:11) on p0
*** call to then() on promise p0 at (ExplicitConstructionAntiPattern.js:11:9:16:11) creates promise p2
SCRIPT EXIT (ExplicitConstructionAntiPattern.js:1:1:27:2)
*** call to Promise() constructor at (ExplicitConstructionAntiPattern.js:12:26:14:15) creates promise p3
*** return from call to Promise() constructor at (ExplicitConstructionAntiPattern.js:12:26:14:15) associates OID obj13 with promise p3
*** promise p1 RESOLVED with value [object Promise] at (ExplicitConstructionAntiPattern.js:15:13:15:36)
*** function  returned value undefined at (ExplicitConstructionAntiPattern.js:11:9:16:11)
*** promise p2 RESOLVED with implicitly returned value undefined at (ExplicitConstructionAntiPattern.js:11:9:16:11)
** endExecution for unit-test
