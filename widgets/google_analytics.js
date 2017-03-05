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
    key = require(__dirname + '/ga_certificate.json'),
    VIEW_ID = 'ga:130461765';

let jwtClient = new google.auth.JWT(key.client_email, null,
    key.private_key, ['https://www.googleapis.com/auth/analytics.readonly'], null);

jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
    let analytics = google.analytics('v3');
    queryData(analytics);
});

function queryData(analytics) {
    analytics.data.ga.get({
        'auth': jwtClient,
        'ids': VIEW_ID,
        "start-date": '7daysAgo',
        "end-date": 'yesterday',
        "metrics": "ga:visits",
        "dimensions": 'ga:day,ga:month,ga:year'
    }, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(JSON.stringify(response, null, 4));
    })
}