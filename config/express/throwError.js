/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

exports.configure = function (app) {


    /**
     * Error 403 handler function
     */
    app.use(function (err, req, res, next) {

        if (err.code !== 'EBADCSRFTOKEN') {
            return next(err);
        }

        if (req.xhr) {
            return res.status(403).send('403 invalid csrf token');
        }

        res.status(403);
        res.send('form tampered with fucker')
    });

    /**
     * Error 404 handler function
     */
    app.use(function (req, res, next) {
        let layer = res.locals.route.substr(0, __config.admin_prefix.length + 2) === `/${__config.admin_prefix}/` ? 'backend' : 'frontend';
        let env = new __viewRender(layer);
        env.render_error(req, res, '404', {
            url: req.originalUrl
        });
        next();
    });

    /**
     * Error 500 handler function
     */
    app.use(function (err, req, res, next) {
        let layer = res.locals.route.substr(0, __config.admin_prefix.length + 2) === `/${__config.admin_prefix}/` ? 'backend' : 'frontend';
        // If the error object doesn't exists
        if (!err) return next();

        __.logger.error(err);
        if (process.env.NODE_ENV == 'development') __.logger.error(err.stack);

        let env = new __viewRender(layer);
        env.render_error(req, res, '500');
        next();
    });
};
