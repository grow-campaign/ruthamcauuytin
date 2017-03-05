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

let Posts = new Schema({
    key: {type: String, required: true},
    name: {type: String},
    title: {type: String},
    image: {type: String},
    alias: {type: String},
    value: {type: Number},
    content: {type: String},
    description: {type: String},
    tags: [{type: String}],
    category_id: [{type: Schema.Types.ObjectId, ref: 'Objects', default: []}],
    attachments: [{type: String}],
    password: {type: String},
    authors: {type: Schema.Types.Mixed},
    logs: [{type: Schema.Types.Mixed}],
    status: {type: Number}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'crabJS_posts'
});

module.exports = mongoose.model('Posts', Posts);