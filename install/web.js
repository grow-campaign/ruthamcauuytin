/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let express = require('express'),
    nunjucks = require('nunjucks'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    app = express(),
    PORT = 3000,
    helmet = require('../config/express/helmet'),
    flash = require('../config/express/flash'),
    crab_func = require('../libraries/global_function'),
    pkg = require('../package.json');

function includes(env, pattern) {
    crab_func.getGlobbedFiles(pattern).forEach(function (path) {
        require(path)(env);
    });
    return env;
}

app.enable("trust proxy");

app.set("showStackError", true);

/**
 * Passing the request url to environment locals
 */
app.use(function (req, res, next) {
    res.locals.url = req.protocol + "://" + req.headers.host + req.url;
    res.locals.route = req.url;
    res.locals.path = req.protocol + "://" + req.headers.host;
    //res.setHeader('Cache-Control', 'public, max-age=600');  // Enable for caching session-flash
    next();
});

/**
 * Helmet module security express application.
 */
helmet.secure(app);

app.use(express.static(path.resolve(`${__base}/install/resource`), {maxAge: 3600}));
app.use(express.static(path.resolve(`${__base}/public`), {maxAge: 3600}));
app.use(express.static(path.resolve(`${__base}/install/views`), {maxAge: 3600}));

app.set('view engine', 'crab');

let env = nunjucks.configure(`${__base}/install/views`, {
    express: app,
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true,
    dev: true,
    noCache: true,
    watch: false
});

// Load nunjucks filters and global variable views.
includes(env, './filters/*.js');

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
}));

app.use(bodyParser.json({limit: "5mb"}));

let controllers = {
    welcome: function (req, res) {
        res.render('welcome.crab', {
            title: 'CrabJS! Web Installer'
        })
    },
    install: function (req, res) {
        res.render('install.crab', {
            title: 'CrabJS! Web Installer'
        })
    },

    installation: function (req, res) {
        crab_func.writeFile('../config/config.json', JSON.stringify(req.body, null, 2));
    },

    launch: function (req, res) {
        console.log(req.body);
    }
};

app.get('/', controllers.welcome);
app.get('/install', controllers.install);
app.post('/install', controllers.installation);
app.post('/launch', controllers.launch);

crab_func.logger.info(`CrabJS v${pkg.version} Copyright (C) 2015-2016 100dayproject.`);
crab_func.logger.info('This program comes with ABSOLUTELY NO WARRANTY.');
crab_func.logger.info('This is free software, and you are welcome to redistribute it under certain conditions.');
crab_func.logger.info('################');
crab_func.logger.info(`Launching web installer on port ${PORT}`);
crab_func.logger.info(`Web installer listening on http://0.0.0.0:${PORT}`);

app.listen(PORT);


module.exports = app;