
SCRIPT ENTER (AllResolveAndReject.js:1:1:18:50) AllResolveAndReject_jalangi_.js AllResolveAndReject.js
*** call to all() on array [1,2,3] at (AllResolveAndReject.js:2:9:2:29) creates promise p0
*** call to Promise.resolve() at (AllResolveAndReject.js:4:30:4:50) creates promise p1
*** return from call to Promise.resolve() at (AllResolveAndReject.js:4:30:4:50) associates OID obj5 with promise p1
*** promise p1 RESOLVED with value 444 at (AllResolveAndReject.js:4:30:4:50)
*** call to all() on array [1,2,3,p1] at (AllResolveAndReject.js:4:10:4:52) creates promise p2
*** call to Promise.reject() at (AllResolveAndReject.js:6:30:6:49) creates promise p3
*** return from call to Promise.reject() at (AllResolveAndReject.js:6:30:6:49) associates OID obj9 with promise p3
*** promise p3 REJECTED with value 555 at (AllResolveAndReject.js:6:30:6:49)
*** call to all() on array [1,2,3,p3] at (AllResolveAndReject.js:6:10:6:51) creates promise p4
SCRIPT EXIT (AllResolveAndReject.js:1:1:18:50)
** endExecution for unit-test
