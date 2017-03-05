/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */


"use strict";

exports.routeLoader = function (app) {

    /**
     * Core routing loader
     * @type {Array}
     */
    require(__base + '/core/core_route')(app);

    require(__base + '/core/api_upload')(app);

    /**
     * Backend interface routing loader
     * @type {Array}
     */
    __.getGlobbedFiles(__base + '/administrator/modules/*/route.js').forEach(function (routePath) {
        app.use('/' + __config.admin_prefix, require(routePath));
    });

    /**
     * User interface routing loader
     * @type {Array}
     */
    __.getGlobbedFiles(__base + '/modules/*/route.js').forEach(function (routePath) {
        require(routePath)(app);
    });
};