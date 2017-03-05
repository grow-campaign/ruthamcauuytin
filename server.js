/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

global.__base = __dirname;

if (require('fs').existsSync('./config/config.json')) {

    // Install already
    let app = require('./bin/crab');
    app.start(2300, {
        debug: true
    });
    module.exports = app;
} else {
    require('./bin/generator')
}