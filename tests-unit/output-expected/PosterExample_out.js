
SCRIPT ENTER (PosterExample.js:1:1:9:1) PosterExample_jalangi_.js PosterExample.js
*** call to Promise.resolve() at (PosterExample.js:1:10:1:34) creates promise p0
*** return from call to Promise.resolve() at (PosterExample.js:1:10:1:34) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value error at (PosterExample.js:1:10:1:34)
*** call to Promise() constructor at (PosterExample.js:2:10:5:3) creates promise p1
*** promise p1 RESOLVED with value success at (PosterExample.js:4:5:4:23)
*** return from call to Promise() constructor at (PosterExample.js:2:10:5:3) associates OID obj5 with promise p1
*** call to all() on array [p0,p1] at (PosterExample.js:6:1:6:22) creates promise p2
*** resolve identity  registered at (PosterExample.js:6:1:8:3) on p2
*** reject identity _default registered at (PosterExample.js:6:1:8:3) on p2
*** call to then() on promise p2 at (PosterExample.js:6:1:8:3) creates promise p3
SCRIPT EXIT (PosterExample.js:1:1:9:1)
*** function  returned value undefined at (PosterExample.js:6:1:8:3)
*** promise p3 RESOLVED with implicitly returned value undefined at (PosterExample.js:6:1:8:3)
** endExecution for unit-test
