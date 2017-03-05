/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

module.exports = {
    db: {
        host: '127.0.0.1:27017',
        database: 'crabJS',
        dialect: 'mongodb',
        options: {
            logging: true,
            replset: {
                name: 'crabJS',
                status: true
            },
            auth: true
        },
        username: 'root',
        password: '123456780'
    },
    redis: {
        host: 'localhost',
        port: '6379',
        prefix_acl: 'acl_',
        prefix_menu: 'menu_',
        prefix_session: '100dayproject_'
    },
    facebookAuth: {
        clientID: process.env.FACEBOOK_ID || '429763933888491',
        clientSecret: process.env.FACEBOOK_SECRET || 'c567934b2f135384a9f3f74e06a40048',
        callbackURL: process.env.FACEBOOK_URL || 'http://localhost:1337/auth/facebook/callback'
    },
    googleAuth: {
        clientID: process.env.GOOGLE_ID || '',
        clientSecret: process.env.GOOGLE_SECRET || '',
        callbackURL: process.env.GOOGLE_URL || ''
    },
    authentication: false
};
