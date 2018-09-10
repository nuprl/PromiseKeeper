
SCRIPT ENTER (PromiseReturnFunAsync2.js:1:1:16:4) PromiseReturnFunAsync2_jalangi_.js PromiseReturnFunAsync2.js
*** call to Promise.resolve() at (PromiseReturnFunAsync2.js:3:10:3:32) creates promise p0
*** return from call to Promise.resolve() at (PromiseReturnFunAsync2.js:3:10:3:32) associates OID obj3 with promise p0
*** promise p0 RESOLVED with value foo at (PromiseReturnFunAsync2.js:3:10:3:32)
*** call to Promise() constructor at (PromiseReturnFunAsync2.js:9:9:11:3) creates promise p1
*** return from call to Promise() constructor at (PromiseReturnFunAsync2.js:9:9:11:3) associates OID obj5 with promise p1
*** resolve identity  registered at (PromiseReturnFunAsync2.js:13:1:16:3) on p1
*** reject identity _default registered at (PromiseReturnFunAsync2.js:13:1:16:3) on p1
*** call to then() on promise p1 at (PromiseReturnFunAsync2.js:13:1:16:3) creates promise p2
SCRIPT EXIT (PromiseReturnFunAsync2.js:1:1:16:4)
*** function  returned value function () {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(73, arguments.callee, this, arguments);
                            arguments = J$.N(81, 'arguments', arguments, 4);
                            return J$.X1(65, J$.Rt(57, J$.R(49, 'p0', p0, 1)));
                        } catch (J$e) {
                            J$.Ex(385, J$e);
                        } finally {
                            if (J$.Fr(393))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            } at (PromiseReturnFunAsync2.js:10:5:10:34)
*** promise p1 REJECTED with value function () {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(73, arguments.callee, this, arguments);
                            arguments = J$.N(81, 'arguments', arguments, 4);
                            return J$.X1(65, J$.Rt(57, J$.R(49, 'p0', p0, 1)));
                        } catch (J$e) {
                            J$.Ex(385, J$e);
                        } finally {
                            if (J$.Fr(393))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            } at (PromiseReturnFunAsync2.js:10:5:10:34)
*** function _default returned value function () {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(73, arguments.callee, this, arguments);
                            arguments = J$.N(81, 'arguments', arguments, 4);
                            return J$.X1(65, J$.Rt(57, J$.R(49, 'p0', p0, 1)));
                        } catch (J$e) {
                            J$.Ex(385, J$e);
                        } finally {
                            if (J$.Fr(393))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            } at (PromiseReturnFunAsync2.js:13:1:16:3)
*** promise p2 REJECTED with value function () {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(73, arguments.callee, this, arguments);
                            arguments = J$.N(81, 'arguments', arguments, 4);
                            return J$.X1(65, J$.Rt(57, J$.R(49, 'p0', p0, 1)));
                        } catch (J$e) {
                            J$.Ex(385, J$e);
                        } finally {
                            if (J$.Fr(393))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            } at (PromiseReturnFunAsync2.js:13:1:16:3)
** endExecution for unit-test
