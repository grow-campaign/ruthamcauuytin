/**
 * Created by hainho on 1/2/16.
 */

module.exports = function(env) {
    "use strict";
    var ObjProto = Object.prototype;

    env.addFilter('isObject', function(obj) {
        return ObjProto.toString.call(obj) === '[object Object]';
    })
};