
SCRIPT ENTER (AllFailFirstBehaviour.js:1:1:39:1) AllFailFirstBehaviour_jalangi_.js AllFailFirstBehaviour.js
*** call to Promise() constructor at (AllFailFirstBehaviour.js:5:10:7:3) creates promise p0
*** return from call to Promise() constructor at (AllFailFirstBehaviour.js:5:10:7:3) associates OID obj3 with promise p0
*** call to Promise() constructor at (AllFailFirstBehaviour.js:8:10:10:3) creates promise p1
*** return from call to Promise() constructor at (AllFailFirstBehaviour.js:8:10:10:3) associates OID obj5 with promise p1
*** call to Promise() constructor at (AllFailFirstBehaviour.js:11:10:13:3) creates promise p2
*** return from call to Promise() constructor at (AllFailFirstBehaviour.js:11:10:13:3) associates OID obj7 with promise p2
*** call to Promise() constructor at (AllFailFirstBehaviour.js:14:10:16:3) creates promise p3
*** return from call to Promise() constructor at (AllFailFirstBehaviour.js:14:10:16:3) associates OID obj9 with promise p3
*** call to Promise() constructor at (AllFailFirstBehaviour.js:17:10:19:3) creates promise p4
*** promise p4 REJECTED with value reject at (AllFailFirstBehaviour.js:18:5:18:21)
*** return from call to Promise() constructor at (AllFailFirstBehaviour.js:17:10:19:3) associates OID obj11 with promise p4
*** call to all() on array [p0,p1,p2,p3,p4] at (AllFailFirstBehaviour.js:21:1:21:34) creates promise p5
*** resolve identity  registered at (AllFailFirstBehaviour.js:21:1:25:3) on p5
*** reject identity  registered at (AllFailFirstBehaviour.js:21:1:25:3) on p5
*** call to then() on promise p5 at (AllFailFirstBehaviour.js:21:1:25:3) creates promise p6
*** call to all() on array [p0,p1,p2,p3,p4] at (AllFailFirstBehaviour.js:31:1:31:34) creates promise p7
*** resolve identity  registered at (AllFailFirstBehaviour.js:31:1:33:3) on p7
*** reject identity _default registered at (AllFailFirstBehaviour.js:31:1:33:3) on p7
*** call to then() on promise p7 at (AllFailFirstBehaviour.js:31:1:33:3) creates promise p8
*** resolve identity _default registered at (AllFailFirstBehaviour.js:31:1:35:3) on p8
*** reject identity  registered at (AllFailFirstBehaviour.js:31:1:35:3) on p8
*** call to catch() on promise p8 at (AllFailFirstBehaviour.js:31:1:35:3) creates promise p9
SCRIPT EXIT (AllFailFirstBehaviour.js:1:1:39:1)
*** function  returned value undefined at (AllFailFirstBehaviour.js:21:1:25:3)
*** promise p6 RESOLVED with implicitly returned value undefined at (AllFailFirstBehaviour.js:21:1:25:3)
*** function _default returned value reject at (AllFailFirstBehaviour.js:31:1:33:3)
*** promise p8 REJECTED with value reject at (AllFailFirstBehaviour.js:31:1:33:3)
*** function  returned value undefined at (AllFailFirstBehaviour.js:31:1:35:3)
*** promise p9 RESOLVED with implicitly returned value undefined at (AllFailFirstBehaviour.js:31:1:35:3)
*** function  returned value one at (AllFailFirstBehaviour.js:6:5:6:36)
*** promise p0 RESOLVED with value one at (AllFailFirstBehaviour.js:6:5:6:36)
*** function  returned value two at (AllFailFirstBehaviour.js:9:5:9:36)
*** promise p1 RESOLVED with value two at (AllFailFirstBehaviour.js:9:5:9:36)
*** function  returned value three at (AllFailFirstBehaviour.js:12:5:12:38)
*** promise p2 RESOLVED with value three at (AllFailFirstBehaviour.js:12:5:12:38)
*** function  returned value four at (AllFailFirstBehaviour.js:15:5:15:37)
*** promise p3 RESOLVED with value four at (AllFailFirstBehaviour.js:15:5:15:37)
** endExecution for unit-test
