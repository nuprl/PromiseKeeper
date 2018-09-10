
SCRIPT ENTER (BluebirdPromiseChain.js:1:1:50:13) BluebirdPromiseChain_jalangi_.js BluebirdPromiseChain.js
*** call to Promise() constructor at (BluebirdPromiseChain.js:7:12:12:7) creates promise p0
*** promise p0 RESOLVED with value A is done at (BluebirdPromiseChain.js:11:9:11:24)
*** return from call to Promise() constructor at (BluebirdPromiseChain.js:7:12:12:7) associates OID obj3 with promise p0
*** resolve identity  registered at (BluebirdPromiseChain.js:45:1:48:7) on p0
*** reject identity _default registered at (BluebirdPromiseChain.js:45:1:48:7) on p0
*** call to then() on promise p0 at (BluebirdPromiseChain.js:45:1:48:7) creates promise p1
*** resolve identity  registered at (BluebirdPromiseChain.js:45:1:49:13) on p1
*** reject identity _default registered at (BluebirdPromiseChain.js:45:1:49:13) on p1
*** call to then() on promise p1 at (BluebirdPromiseChain.js:45:1:49:13) creates promise p2
*** resolve identity  registered at (BluebirdPromiseChain.js:45:1:50:13) on p2
*** reject identity _default registered at (BluebirdPromiseChain.js:45:1:50:13) on p2
*** call to then() on promise p2 at (BluebirdPromiseChain.js:45:1:50:13) creates promise p3
SCRIPT EXIT (BluebirdPromiseChain.js:1:1:50:13)
*** call to Promise() constructor at (BluebirdPromiseChain.js:17:12:24:7) creates promise p4
*** return from call to Promise() constructor at (BluebirdPromiseChain.js:17:12:24:7) associates OID obj23 with promise p4
promise p1 LINKED with promise p4
*** promise p4 RESOLVED with value B is done at (BluebirdPromiseChain.js:22:13:22:28)
*** function  returned value B is done at (BluebirdPromiseChain.js:45:1:48:7)
*** promise p1 RESOLVED with implicitly returned value B is done linked from promise p4 at (BluebirdPromiseChain.js:45:1:48:7)
*** call to Promise() constructor at (BluebirdPromiseChain.js:29:12:33:7) creates promise p5
*** promise p5 RESOLVED with value C is done at (BluebirdPromiseChain.js:32:9:32:24)
*** return from call to Promise() constructor at (BluebirdPromiseChain.js:29:12:33:7) associates OID obj27 with promise p5
promise p2 LINKED with promise p5
*** function  returned value C is done at (BluebirdPromiseChain.js:45:1:49:13)
*** promise p2 RESOLVED with explicitly returned value C is done linked from promise p5 at (BluebirdPromiseChain.js:45:1:49:13)
*** call to Promise() constructor at (BluebirdPromiseChain.js:38:12:42:7) creates promise p6
*** promise p6 RESOLVED with value D is done at (BluebirdPromiseChain.js:41:9:41:24)
*** return from call to Promise() constructor at (BluebirdPromiseChain.js:38:12:42:7) associates OID obj29 with promise p6
promise p3 LINKED with promise p6
*** function  returned value D is done at (BluebirdPromiseChain.js:45:1:50:13)
*** promise p3 RESOLVED with explicitly returned value D is done linked from promise p6 at (BluebirdPromiseChain.js:45:1:50:13)
** endExecution for unit-test
