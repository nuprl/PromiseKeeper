// Author: Rezwana Karim
const path = require('path');
var loggerUtils = require('./logger-helper');

(function (sandbox) {
    if (typeof sandbox.InformationFlow.Utils !== 'undefined') {
        return;
    }

    if(!sandbox.Constants.isBrowser)
        var shell = require('shelljs');


    var Utils = sandbox.InformationFlow.Utils = {};

    var smemory = sandbox.smemory;

    Utils.getValOid = function (value, oidToPromiseInfo, proxyPromisesIds) {
        var retVal;
        var objOid = loggerUtils.isPrim(value) ? "" : Utils.getObjectID(value, "", loggerUtils.isFunction(value));
        retVal = objOid;
        if (value instanceof Promise) {
            oidToPromiseInfo[objOid].id ? retVal = oidToPromiseInfo[objOid].getPromiseId() : retVal = proxyPromisesIds[JSON.stringify(value)];
        }
        return retVal;
    };

    /**
     * For name, get the function where it is declared
     * @param name
     */
    Utils.getFunction = function(name){
        var frame = smemory.getShadowFrame(name);
        var func = smemory.getActualObjectOrFunctionFromShadowObjectOrFrame(frame);

        return func;
    };

    /* associate a unique number with each object */

    Utils.getFrameID = function(name){
        var frame = smemory.getShadowFrame(name);
        var id = smemory.getIDFromShadowObjectOrFrame(frame);

        return "frame"+id;
    };

    /* associate a unique number with each object */

    Utils.getObjectID = function getObjectID(obj, prop, isGetField){
        var shadowObj = smemory.getShadowObject(obj, prop, isGetField);
        //returns an object even
        // ---- if its a global object i.e defined in global scope and not declared with var
        //----- if its a function object

        //shadowObj is false -> obj is actually not an object defined in the program being analyzed. Refer: shadow/test-globals num
        if(shadowObj !== false){
            //if owner is not defined in shadowObj. case: getField for a property that is not found in object or its prototype chain
            if(shadowObj.owner === undefined){
                //treat the operation as a putField to retrieve objectID from shadow memory
                shadowObj = smemory.getShadowObject(obj, prop, false);
                //return "PROP_NOT_FOUND";
            }
            var id = smemory.getIDFromShadowObjectOrFrame(shadowObj.owner);
            return "obj" + id;
        }
        else{
            //return "NOT_Object";
            throw new Error("** Object ID could not be retrieved for : " + JSON.stringify(obj) + " **");
        }

    };

    /* for debugging */
    Utils.getLocation = function(iid){

        var printFullPath = (sandbox.Spec.printFullPath !== undefined)? sandbox.Spec.printFullPath: false;

        iid = sandbox.getGlobalIID(iid);
        var locationStr = sandbox.iidToLocation(iid);

        if(printFullPath){
            if(sandbox.Constants.isBrowser)
                return locationStr;
            //for node.js files, we can get rid of the prefix that represents the TOOL_HOME
            //** importing shelljs module here causes env variable to be undefined. Posibly the env is yet to be loaded at that point
            var TOOL_HOME = shell.env['TOOL_HOME'];
            var prefix = locationStr.substr(1, TOOL_HOME.length);//locationstr starts with a '('
            if(prefix !== TOOL_HOME)
                throw  new Error("Prefix ("+ prefix +") of location  does not contain or match with the TOOL_HOME env variable " + TOOL_HOME);
            locationStr = locationStr.substr(1+TOOL_HOME.length+1);// the last one to get rid of the first '/' of the remaining string

            return '('+locationStr;
        }

        // get rid of full file path
        if(locationStr.indexOf('<a href') === 0){
            // location string  has the format <a href =( )> (/path-to-js/app.js:1:100)</a>
            //get the subtring between last '(' '<'  from the string
            locationStr = locationStr.substr(locationStr.lastIndexOf('(')+1);
            locationStr = locationStr.substr(0, locationStr.lastIndexOf('<'));
            locationStr = locationStr.substr(locationStr.lastIndexOf(path.sep)+1);
        }
        else
            locationStr = locationStr.substr(locationStr.lastIndexOf(path.sep)+1);

        return '('+locationStr; // adding ( at the front of location string
    };

    Utils.getStartLocation = function(iid){
        var locationStr = Utils.getLocation(iid);
        var tmp = locationStr.substring(0, locationStr.lastIndexOf(':'));
        var startLocation = tmp.substring(0, tmp.lastIndexOf(':')) + ')';
        return startLocation;
    };

    function getPropID(objId, prop){
        return objId + "_" + prop;
    }



    Utils.assert = function (condition, message) {
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    };

    Utils.isJalangiObj = function(obj){
        var objStr = obj.toString(); 
        if((objStr.indexOf('J$') > -1) || (objStr.indexOf('JalangiLabel') > -1)){
            if(typeof obj !== 'function')
                return false;//throw 'Jalangi object is not a function';
            return true;
        }

        return false;
    };

    Utils.isNonNullObject = function(val){
        if (val !== null && typeof val === 'object')
            return true;
        else
            return false;
    };

    Utils.isArray = function(val){
      return  val.constructor == Array;
    };

    Utils.isPrimitive = function(val){
       if ((typeof val === 'string') || (typeof val === 'number')||(typeof val === 'boolean'))
           return true;

       return false;

    };

    Utils.isPrimitiveWrapperObj = function(obj){
        return Utils.isPrimitiveWrapperFunction(obj.constructor);

    };

    Utils.isPrimitiveWrapperFunction = function(f){
        if((f === String) || (f === Number)||(f === Boolean))
            return true;

        return false;

    };

    Utils.isAjaxXMLResponse = function(base, offset){
        if(sandbox.Constants.isBrowser && base instanceof XMLHttpRequest && offset === 'responseXML')
            return true;

        return false;

    };

    Utils.isNavigatorBatteryUndefined = function(base, offset, val){
        if(sandbox.Constants.isBrowser && (base instanceof Navigator) && offset === 'battery' && val === undefined)
            return true;

        return false;
    };

    Utils.isInTestFile = function(location, appName){
        location = location.substring(1); // get rid of  '('
        var fileName = location.substring(location.lastIndexOf(path.sep)+1, location.indexOf('.'));
        return  fileName === appName;
    };

    Utils.escapeChar = function(s){
        return s.replace("\\","backslash").replace('\t','\\t').replace('\n','\\n').replace('\r','\\r').replace('\u2028','u2028').replace('\u2029','u2029').replace("'","quote");
    }

})(J$);

