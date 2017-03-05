/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

require('../config/env').init(process.env.NODE_ENV || 'development');

global.__ = require("../libraries/global_function");
global.__config = require('lodash').extend(__env, require("../config/config.json"));
global.__models = require("../libraries/models_manager");
global.__viewRender = require("../libraries/render_manager");

/**
 * @Crab
 * Main application <life-parser version 2>
 */

class crab {

    static start(port, opt) {

        let app = require("../config/express")();
        let PORT = process.env.PORT || port || __config.port;
        app.listen(PORT);
        if (opt && opt.debug) {
            __.logger.info(`Application config information:
            => Template engine: Nunjucks
            => Model database: Mongodb
            => Theme current: Bootstrap\n`);

            __.logger.info(`=> Listening on port ${PORT}. Process ID: ${process.pid}`);
        }
    }
}

module.exports = crab;