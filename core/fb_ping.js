/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let firebase = require('firebase'),
    ref_user_online = firebase.database().ref('users'),
    ref_common_notifications = firebase.database().ref(`/common/notifications`),
    fs = require('fs'),
    path = require('path');

module.exports = function (app) {

    app.route('/ping/:user_id').get(function (req, res) {

        let ref_user_notifications = firebase.database().ref(`/notifications/user/${req.params.user_id}`);


        let files = fs.readdirSync(__base + '/config/base');
        if (path.extname(files[0]) == '.json') {
            if (firebase.apps.length == 0) {
                firebase.initializeApp({
                    databaseURL: '',
                    serviceAccount: __base + '/config/firebase/' + files[0]
                })
            }

        } else {
            return res.status(200).send("Service Account worker not found!");
        }
    })
};