/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    passport.use('AdminLogin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        process.nextTick(function () {
            __models.Users.findOne({
                email: email,
                type: 0,
                status: 'Available'
            }, function (err, user) {
                if (err) {
                    return done(err);
                } else if (user) {

                    let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    // let user_agent = req.useragent;

                    if (user.validPassword(password)) {
                        __models.Users.findByIdAndUpdate(user.id, {
                            last_login_date: Date.now(),
                            $addToSet: {web_session: {
                                session_id: req.sessionID,
                                ip_address: ip_address,
                            }}
                        }).exec(function (err) {
                            if (err) {
                                __.logger.error(err);
                                return done(null, false, {message: 'Connect server error!'});
                            }
                        });
                        // Tracking user login
                        __.loginTracking({
                            user_id: user._id,
                            ip_address: ip_address,
                            login_status: "Success",
                            strategy: 'Local'
                        });
                        return done(null, user);
                    } else {
                        // Tracking user login
                        __.loginTracking({
                            user_id: user._id,
                            ip_address: ip_address,
                            login_status: "Failed"
                        });
                        return done(null, false, {message: 'Oops! Invalid login credentials.'});
                    }
                } else {
                    return done(null, false, {message: 'The specified email does not exist.'})
                }
            })
        })
    }));
};