/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";
let env = require('../config/env'),
    assert = require('assert'),
    should = require('should');

let testEnv = new env();


describe('ENV', function () {
    describe('#Validate data', function () {
        it('[New instance] User custom config instance', function () {
            testEnv._configValid({
                name: 'custom', config: {
                    db: {
                        host: '127.0.0.1:27017',
                        database: 'crabInstance',
                        dialect: 'mongodb',
                        options: {
                            auth: false,
                            logging: true,
                            replset: false
                        }
                    }
                }
            }).should.equal(true);
        })
    });

    describe('#Init Environment', function () {
        it('[Static] Regex valid IP address', function () {
            env._validIP('125.25.154.18').should.equal(true);
            env._validIP('185.125.4.f').should.equal(false);
            env._validIP('185.125.4f').should.equal(false);
            env._validIP('185.125.4>').should.equal(false);
        });

        it('[Static] Regex valid Port address', function () {
            env._validPort('133O7').should.equal(false);
            env._validPort('0').should.equal(true);
            env._validPort('1337').should.equal(true);
            env._validPort('65535').should.equal(true);
            env._validPort('65536').should.equal(false);
        });

        it('[Static] Valid dialect database use custom', function () {
            env._validDialect('Crab').should.equal(false);
            env._validDialect('Postgres').should.equal(true);
            env._validDialect('pOsTGres').should.equal(true);
            env._validDialect('MONG0DB').should.equal(false);
            env._validDialect('postgres    ').should.equal(true);
            env._validDialect('postgres,mongodb').should.equal(false);
        });

        it('[Static] Validate default environment values', function () {
            function dev() {
                let dev = require('../config/env-test');
                return dev.db && dev.db.host && dev.db.database && dev.db.dialect ? true : false;
            }

            assert.equal(dev(), true);
        });

        it('[Static] Main init function', function () {

        })
    })
});