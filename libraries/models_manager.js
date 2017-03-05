/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let mongoose = require('mongoose'),
    db = {};
var extendServer = '/';
if (__config.db.options.replset.status) extendServer = `,${__config.db.secondary}/`;

let mongoUri = `mongodb://${__config.db.host}${extendServer}${__config.db.database}`;

var options = {
    db: {native_parser: true},
    server: {
        socketOptions: {keepAlive: 1},
        poolSize: 5
    },
    auth: {
        authdb: 'admin'
    },
    replset: {
        rs_name: __config.db.options.replset.name,
        socketOptions: {keepAlive: 1}
    }
};

if (__config.db.options.auth) {
    options.user = __config.db.username;
    options.pass = __config.db.password
}

mongoose.connect(mongoUri, options);
mongoose.connection.on('error', function (err) {
    if (err.message.indexOf('EHOSTUNREACH')) {
        __.logger.warn('There is no Internet connection');
        process.exit(1);
    }
    if (err) throw err;
});

mongoose.set('debug', __config.db.options.logging);

db.collections = [];
__.getGlobbedFiles(__base + '/models/**/*.js').forEach(function (modelPath) {
    let model = require(modelPath);
    db[model.modelName] = model;
    // db.collections.push(model.modelName);
});

__.logger.info(`[Success] Load all the models.\n`);

module.exports = db;