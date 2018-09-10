
SCRIPT ENTER (PromiseReturnObjLinking1.js:1:1:16:1) PromiseReturnObjLinking1_jalangi_.js PromiseReturnObjLinking1.js
*** call to Promise() constructor at (PromiseReturnObjLinking1.js:7:10:7:65) creates promise p0
*** promise p0 RESOLVED with value [object Object] at (PromiseReturnObjLinking1.js:7:50:7:62)
*** return from call to Promise() constructor at (PromiseReturnObjLinking1.js:7:10:7:65) associates OID obj5 with promise p0
*** call to Promise.resolve() at (PromiseReturnObjLinking1.js:8:10:8:29) creates promise p1
*** return from call to Promise.resolve() at (PromiseReturnObjLinking1.js:8:10:8:29) associates OID obj7 with promise p1
*** promise p1 RESOLVED with value 17 at (PromiseReturnObjLinking1.js:8:10:8:29)
*** resolve identity  registered at (PromiseReturnObjLinking1.js:9:1:12:3) on p0
*** reject identity _default registered at (PromiseReturnObjLinking1.js:9:1:12:3) on p0
*** call to then() on promise p0 at (PromiseReturnObjLinking1.js:9:1:12:3) creates promise p2
*** resolve identity  registered at (PromiseReturnObjLinking1.js:9:1:15:3) on p2
*** reject identity _default registered at (PromiseReturnObjLinking1.js:9:1:15:3) on p2
*** call to then() on promise p2 at (PromiseReturnObjLinking1.js:9:1:15:3) creates promise p3
SCRIPT EXIT (PromiseReturnObjLinking1.js:1:1:16:1)
promise p2 LINKED with promise p1
*** function  returned value 17 at (PromiseReturnObjLinking1.js:9:1:12:3)
*** promise p2 RESOLVED with explicitly returned value 17 linked from promise p1 at (PromiseReturnObjLinking1.js:9:1:12:3)
*** function  returned value 17 at (PromiseReturnObjLinking1.js:9:1:15:3)
*** promise p3 RESOLVED with explicitly returned value 17 at (PromiseReturnObjLinking1.js:9:1:15:3)
** endExecution for unit-test
