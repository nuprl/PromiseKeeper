
SCRIPT ENTER (NewPromiseResolveLater2.js:1:1:23:28) NewPromiseResolveLater2_jalangi_.js NewPromiseResolveLater2.js
*** call to Promise() constructor at (NewPromiseResolveLater2.js:7:19:9:7) creates promise p0
*** return from call to Promise() constructor at (NewPromiseResolveLater2.js:7:19:9:7) associates OID obj3 with promise p0
*** call to Promise() constructor at (NewPromiseResolveLater2.js:7:19:9:7) creates promise p1
*** return from call to Promise() constructor at (NewPromiseResolveLater2.js:7:19:9:7) associates OID obj5 with promise p1
*** resolve identity  registered at (NewPromiseResolveLater2.js:13:1:16:3) on p0
*** reject identity _default registered at (NewPromiseResolveLater2.js:13:1:16:3) on p0
*** call to then() on promise p0 at (NewPromiseResolveLater2.js:13:1:16:3) creates promise p2
*** resolve identity  registered at (NewPromiseResolveLater2.js:17:1:20:3) on p1
*** reject identity _default registered at (NewPromiseResolveLater2.js:17:1:20:3) on p1
*** call to then() on promise p1 at (NewPromiseResolveLater2.js:17:1:20:3) creates promise p3
*** promise p0 RESOLVED with value foo at (NewPromiseResolveLater2.js:22:1:22:27)
*** promise p1 RESOLVED with value bar at (NewPromiseResolveLater2.js:23:1:23:27)
SCRIPT EXIT (NewPromiseResolveLater2.js:1:1:23:28)
*** function  returned value foo at (NewPromiseResolveLater2.js:13:1:16:3)
*** promise p2 RESOLVED with explicitly returned value foo at (NewPromiseResolveLater2.js:13:1:16:3)
*** function  returned value bar at (NewPromiseResolveLater2.js:17:1:20:3)
*** promise p3 RESOLVED with explicitly returned value bar at (NewPromiseResolveLater2.js:17:1:20:3)
** endExecution for unit-test
