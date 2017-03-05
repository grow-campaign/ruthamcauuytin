/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */


"use strict";

let path = require('path'),
    os = require('os'),
    express = require('express'),
    logger = require('morgan'),
    userAgent = require('express-useragent'),
    flash = require('connect-flash'),
    helmet = require('helmet'),
    csrf = require('csurf'),
    errorhandler = require('errorhandler'),
    notifier = require('node-notifier'),
    viewEngine = require('./nunjucks'),
    requestParser = require('./requestParser'),
    appLoader = require('./appLoaders'),
    throwError = require('./throwError'),
    passport = require('../passports'),
	favicon = require('serve-favicon')

module.exports = function () {

    // Initialization express application
    let app = express();

    app.use(favicon(__base + '/public/favicon_v1.png'))

    if (process.env.NODE_ENV === 'development' || os.hostname() == 'Razor') {
        app.use(logger('dev'));

        /** Disable views cache */
        app.set('view cache', false);
        app.enable('verbose errors');
    } else {
        app.locals.cache = 'memory';
        app.disabled('verbose errors');

        /** trust first proxy */
        app.set('trust proxy', 1);

    }
    app.enable("trust proxy");

    app.set("showStackError", true);

    app.use(express.static(path.resolve('./public'), {maxAge: 3600}));
    app.use('/themes',express.static(path.resolve('./themes'), {maxAge: 3600}));

    app.use(userAgent.express());

    /**
     * Passing the request url to environment locals
     */
    app.use(function (req, res, next) {
        res.locals.uri = req.protocol + "://" + req.headers.host + req.url;
        res.locals.url = req.url;
        res.locals.route = req.url;
        res.locals.path = req.protocol + "://" + req.headers.host;
        //res.setHeader('Cache-Control', 'public, max-age=600');  // Enable for caching session-flash
        next();
    });

    /**
     * Helmet module security express application.
     * Use helmet to security web application, xss vulnerability,..
     */

    // frameGuard to prevent clickjacking
    app.use(helmet.frameguard({action: 'sameorigin'}));
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.enable("trust proxy");
    app.set("trust proxy", true);
    app.use(helmet.hidePoweredBy({setTo: "PHP 4.2.0"}));
    //app.disable("x-powered-by");


    function errorNotification(err, str, req) {
        var title = 'Error in ' + req.method + ' ' + req.url;

        notifier.notify({
            title: title,
            message: str,
            icon: __base + '/public/images/whynotbar.png',
            wait: true,
            sound: true
        })
    }

    /**
     * Request parser call bodyParser, cookie-parser, cookie-parser, express-session for storage
     * and extends `delete` method using methodOverride module
     */
    requestParser.configure(app);


    let view = new viewEngine(app);
    view.configure({
        path: __base + '/',
        autoescape: false,
        dev: true
    }, {
        showConfigure: true
    });

    /**
     * Connect-flash module middleware
     */
    app.use(flash());
    app.use(function (req, res, next) {
        if (!req.session){
            console.log("\nERROR: redis server does not start\n");
            res.status(500).send('ERROR: redis server does not start');
            process.exit(1);
        }
        res.locals.messages = req.session.flash;
        delete req.session.flash;
        next();
    });

    /**
     * Passport strategies
     */
    passport.configure(app);

    app.use(csrf());
    app.use(function (req, res, next) {
        req.csrfToken();
        res.locals._csrf = req.csrfToken();
        next();
    });

    /**
     * Application router loader modules
     */
    appLoader.routeLoader(app);

    /**
     * Logging exception error any status
     */
    throwError.configure(app);

    if (require('os').hostname() == 'Razor') {
        app.use(errorhandler({log: errorNotification}));
    }

    return app;
};