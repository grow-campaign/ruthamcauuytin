/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let glob = require('glob'),
    chalk = require('chalk'),
    environment = ['development', 'test', 'production'];

class env {
    constructors() {
        let self = this;
    }

    /**
     * Check configuration user define new config instance
     * @returns {boolean}
     *
     * Example:
     *
     * let customENV = new env({
     *    name: 'Crab', config: {
     *      db: {
     *          host: '127.0.0.1:27017',
     *          database: 'crabInstance',
     *          dialect: 'mongodb',
     *          options: {
     *              logging: true,
     *              replset: false,
     *              auth: false
     *          }
     *      }
     *    }
     * })
     * @param ip
     */

    static _validIP(ip) {
        return RegExp("^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$").test(ip) ? true : false;
    }

    static _validPort(port) {
        return RegExp("^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$").test(port) ? true : false;
    }

    static _validDialect(dialect) {
        let DBcrab = dialect.toLowerCase().trim();
        return ['mongodb', 'mysql', 'postgres'].indexOf(DBcrab) >= 0 ? true : false;
    }

    _configValid(custom) {
        function _hostValid(host) {
            return env._validIP(host.split(':')[0]) && env._validPort(host.split(':')[1]) ? true : false;
        }

        return custom.config && custom.config.db && _hostValid(custom.config.db.host) && custom.config.db.database && env._validDialect(custom.config.db.dialect) ? true : false;
    }

    /**
     * Before we begin, lets set the environment variable
     * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
     */

    static init(e) {
        if (process.env.NODE_ENV) {
            if (environment.indexOf(process.env.NODE_ENV) >= 0) {
                console.log(chalk.bold.green(`\n[NODE_ENV] Application loaded using the ${process.env.NODE_ENV} environment configuration.\n`));
            } else {
                console.error(chalk.red(`\n[Warning] Configuration not found for ${process.env.NODE_ENV} environment using [development, test, production] instead.\n`));
                process.exit(0);
            }
        } else if (environment.indexOf(e) >= 0) {
            console.log(chalk.bold.green(`\n[Initialize] Application loaded using the ${e} environment configuration.\n`));

        } else {
            console.error(chalk.red(`\n[Default] NODE_ENV is not defined! Using default product environment.\n`));
        }
        env.checkEnv(process.env.NODE_ENV || e || 'production');
    }

    static checkEnv(e) {
        if (e == 'development') {
            global.__env = require('./env-development');
        } else if(e == 'test') {
            global.__env = require('./env-test');
        } else {
            global.__env = require('./env-production');
        }
    }
}

module.exports = env;