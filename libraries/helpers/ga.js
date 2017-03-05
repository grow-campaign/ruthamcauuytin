/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let google = require('googleapis'),
    CLIENT_ID = '1088344376413-220618hg1c06d8p3bitjsbt2k74g1l68.apps.googleusercontent.com',
    CLIENT_SECRET = 'cBnnCAb2oaQc4WlxQh8Og7oj',
    oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'postmessage'),
    analytics = google.analytics('v3'),
    SERVICE_ACCOUNT_EMAIL = '1088344376413-220618hg1c06d8p3bitjsbt2k74g1l68@developer.gserviceaccount.com',
    SERVICE_ACCOUNT_KEY_FILE = __base + '/config/test_100dayproject_key.pem';
let jwt = new google.auth.JWT(SERVICE_ACCOUNT_EMAIL, SERVICE_ACCOUNT_KEY_FILE, null, ['https://www.googleapis.com/auth/analytics.readonly']);
let access_token = '',
    expiry_date = 0;

exports.getGoogleInformation = function (cb) {
    jwt.authorize(function(err, result) {
        if (err) setTimeout(cb(null), 0);
        else {
            access_token = result.access_token;
            expiry_date = result.expiry_date;
            oauth2.setCredentials({
                access_token: result.access_token
            });
            analytics.data.ga.get({
                auth: oauth2,
                "ids": "ga:59684062",
                "start-date": '7daysAgo',
                "end-date": 'yesterday',
                "metrics": "ga:visits",
                "dimensions": 'ga:day,ga:month,ga:year'
            }, function(err, body) {
                if (err) {
                    setTimeOut(cb(null), 0);
                } else {
                    var data = [];
                    if (body != null) {
                        body.rows.sort(function (a, b) {
                            if ((a[2] - b[2]) == 0) {
                                return a[1] - b[1];
                            }
                            else {
                                return a[2] - b[2];
                            }

                        });
                        for (var i in body.rows) {
                            if (body.rows.hasOwnProperty(i)){
                                var day = parseInt(body.rows[i][0]);
                                var month = parseInt(body.rows[i][1]);
                                var year = parseInt(body.rows[i][2]);
                                var value = parseInt(body.rows[i][3]);
                                var vl = [day + '/' + month + '/' + year, value];
                                data.push(vl);
                            }
                        }
                    }

                    setTimeout(cb(data), 0);
                }
            })
        }
    })

};
































