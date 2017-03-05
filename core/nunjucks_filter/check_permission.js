"use strict";

module.exports = function (env) {
    env.addFilter('check_permission', function (role, acl) {
        if (acl && role) {
            if (acl.indexOf(role) >= 0) {
                return true
            } else {
                return false;
            }
        }
    })
};