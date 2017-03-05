/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let LoginTracking = new Schema({
    user_id: {type: String, required: true},
    user_agent: {type: Schema.Types.Mixed},
    ip_address: {type: String},
    login_status: {type: String},
    strategy: {type: String}
}, {
    timestamps: {
        createdAt: 'created_at'
    },
    collection: 'crabJS_LoginTracking'
});

module.exports = mongoose.model('LoginTracking', LoginTracking);