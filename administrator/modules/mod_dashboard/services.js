/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

/**
 * Demo API Services
 * @type {{addUser: ver1.addUser}}
 */

let ver1 = {
    addUser: function (user, next) {
        let newUser = new __models.Users({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            avatar: user.avatar
        });

        newUser.save(function (err) {
            if (err) {
                return next(err);
            }
            next(null);
        })
    }
};

let ver2 = {};

module.exports = ver1;