/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let passport = require('passport');

exports.configure = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    // Using for create session
    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    // Using for destroy session
    passport.deserializeUser(function (id, done) {
        __models.Users.findById(id, function (err, user) {
            if (user)
                return done(err, user);
        });
    });

    require('./strategies/local')(passport);
    require('./strategies/google')(passport);
    require('./strategies/facebook')(passport);
};