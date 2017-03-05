/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let CLIENT_ID = '964145041642-do0aeu2fc6vb6qnt2c4r7rd3ro0ju7av.apps.googleusercontent.com',
    CLIENT_SECRET = 'DdUwChMoWiy66un32UzmYB2I';

let googleapis = require('googleapis');
let oauth2 = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'postmessage');

var SERVICE_ACCOUNT_EMAIL = 'hai100dayproject@api-project-964145041642.iam.gserviceaccount.com';
var SERVICE_ACCOUNT_KEY_FILE = '../../config/100dayproject_key.p12';
var jwt = new googleapis.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    SERVICE_ACCOUNT_KEY_FILE,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']);

var client;
googleapis
    .discover('analytics', 'v3')
    .execute(function(err, data) {
        client = data;

        jwt.authorize(function(err, result) {
            oauth2.setCredentials({
                access_token: result.access_token
            });

            client.analytics.data.ga.get({
                    "ids": "ga:53225314",
                    "start-date": 'YYYY-MM-DD',
                    "end-date": 'YYYY-MM-DD',
                    "metrics": "ga:visits"
                })
                .withAuthClient(oauth2)
                .execute(function(err, result) {
                    console.log(err, result);
                });
        });
    });
