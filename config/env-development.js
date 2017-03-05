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
        database: 'crabjs',
        dialect: 'mongodb',
        options: {
            logging: true,
            replset: {
                name: 'CrabJS',
                status: false
            },
            auth: false
        },
        username: 'root',
        password: '&-qQg,dhm,Al.'
    },
    email: {
        auth: {
            user: 'hai100dayproject',
            pass: 'hainho'
        },
        headers: {'100dayproject.org': 'Researcher, Developer & Writer.'},
        from: `100dayproject.org <hai@100dayproject.org>`
    },
    redis: {
        host: 'localhost',
        port: '6379',
        prefix_acl: 'acl_',
        prefix_menu: 'menu_',
        prefix_session: '100dayproject_'
    },
    facebookAuth: {
        clientID: '1040856459306625',
        clientSecret: 'ec5520242b04ac459e61e9c8ff634e37',
        callbackURL: '/auth/facebook/callback'
    },
    googleAuth: {
        clientID: '964145041642-do0aeu2fc6vb6qnt2c4r7rd3ro0ju7av.apps.googleusercontent.com',
        clientSecret: '5F07ksmH6HUoZRRum38rmuOp',
        callbackURL: '/auth/google/callback'
    },
    nodeAnalytics: {
        KEY: "HvzEtsA8RfvY78XRbiXFTv3wflJTDDX0"
    },
    authentication: true,
    domain_prefix: "http://localhost:3000"
};