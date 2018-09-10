/**
 * Taken from Jalangi2 sample_analyses/dataraces
 */
//Author: Koushik Sen
//Author: Rezwana Karim

const path = require('path');

(function (sandbox) {


    if (typeof sandbox.InformationFlow === 'undefined') {
        sandbox.InformationFlow = {};
    }
    sandbox.Spec = { appInfo : { name:"unit-test" } };

    var TraceWriter = function() {
        var DEBUG = false;

        var reportInBrowser =  (sandbox.Spec.reportInBrowser !== undefined)? sandbox.Spec.reportInBrowser: false;

        var Constants = sandbox.Constants;
        var Config = sandbox.Config;

        var traceFileName;
        var bufferSize = 0;
        var buffer = [];
        var traceWfh;
        var fs = (!Constants.isBrowser) ? require('fs') : undefined;
       // var shell = (!Constants.isBrowser) ? require('shelljs') : undefined;
        //var TOOL_HOME = (shell)?shell.env['TOOL_HOME']:"/tmp";
        var trying = false;
        var cb;
        var remoteBuffer = [];
        var socket, isOpen = false;
        // if true, in the process of doing final trace dump,
        // so don't record any more events
        var tracingDone = false;

        var chunkCount = 0;

        function getFileHandle() {
            if (traceWfh === undefined) {
                traceWfh = fs.openSync(traceFileName, 'w');
            }
            return traceWfh;
        }

        this.setTraceFileName = function(outputFileName){
            if(outputFileName === undefined){
                traceFileName = "/tmp/sif-trace.js";
                return;
            }

            traceFileName = outputFileName;
        };

        this.initTracing = function(outputFileName){
            if(!sandbox.Constants.isBrowser)
                this.setTraceFileName(outputFileName);
            else{
                if(reportInBrowser)
                    return;
                // set up a web socket to send traces to a remote server
                this.remoteLog('sif-open:' + outputFileName);
                this.remoteLog('reset');
            }
        };


        /**
         * @param {string} line
         */
        this.logToFile = function (line) {

            if (tracingDone) {
                // do nothing
                return;
            }

// FT 5/23/17 the buffering code is buggy -- fails to log all output on modulify-eval. Avoiding buffering for now.
            fs.writeSync(getFileHandle(), line);
            return;
        };


        this.flush = function () {
            var msg;
            if (!Constants.isBrowser) {
                var length = buffer.length;
                for (var i = 0; i < length; i++) {
                    fs.writeSync(getFileHandle(), buffer[i]);
                   // console.log(buffer[i]);//for demo purpose
                }
            } else {
                msg = buffer.join('');
                if (msg.length > 1) {
                    if(reportInBrowser){
                        if(chunkCount === 0)
                            localStorage.clear();
                        var chunkKey = 'chunk' + (chunkCount++);
                        localStorage.setItem(chunkKey, msg);
                    }
                    else
                        this.remoteLog(msg);
                }
            }
            bufferSize = 0;
            buffer = [];
        };


        function openSocketIfNotOpen() {
            if (!socket) {
                if(DEBUG) console.log("Opening connection");
                socket = new WebSocket('ws://127.0.0.1:8089', 'log-protocol');
                socket.onopen = tryRemoteLog;
                socket.onmessage = tryRemoteLog2;
            }
        }

        /**
         * invoked when we receive a message over the websocket,
         * indicating that the last trace chunk in the remoteBuffer
         * has been received
         */
        function tryRemoteLog2() {
            if(DEBUG) console.log('tryREmoteLog2');

            trying = false;
            remoteBuffer.shift();
            if (remoteBuffer.length === 0) {
                if (cb) {
                    cb();
                    cb = undefined;
                }
            }
            tryRemoteLog();
        }

        this.onflush = function (callback) {
            if(DEBUG) console.log('onflush');

            if (remoteBuffer.length === 0) {
                if (callback) {
                    callback();
                }
            } else {
                cb = callback;
                tryRemoteLog();
            }
        };

        function tryRemoteLog() {
            if(DEBUG) console.log('tryREmoteLog');
            isOpen = true;
            if (!trying && remoteBuffer.length > 0) {
                trying = true;
                //socket.send('reset');
                socket.send(remoteBuffer[0]);

            }
        }

        this.remoteLog = function (message) {
            if(DEBUG) console.log('REmoteLog');

            if (message.length > Config.MAX_BUF_SIZE) {
                throw new Error("message too big!!!");
            }
            remoteBuffer.push(message);
            openSocketIfNotOpen();
            if (isOpen) {
                if(DEBUG) console.log('isopen flag true');
                tryRemoteLog();
            }
        };

        /**
         * stop recording the trace and flush everything
         */
        this.stopTracing = function () {
            tracingDone = true;
            this.flush();
            if(reportInBrowser)
                this.analyzeTrace();
        };

        this.analyzeTrace = function(){
            var instr = '';
            for(var i = 0; i<chunkCount; i++){
                var chunkKey = 'chunk' + i;
                var chunk = localStorage.getItem(chunkKey);
                instr += chunk;
            }

            eval(instr);// run the abstract stack machine
        };
    };

    sandbox.InformationFlow.TraceWriter = TraceWriter;
})(J$);
