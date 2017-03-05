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

/**
 * KEY OBJECT STORE
 *
 * SEO Settings:        seo:settings
 * Roles:               objects:roles
 * User Type:           objects:user_type
 * Theme:               objects:theme
 * Article Category:    objects:category
 *
 */

let Objects = new Schema({
    key: {type: String, required: true},
    favicon: {type: String},
    app_name: {type: String},
    site_title: {type: String},
    site_description: {type: String},
    site_keywords: {type: String},
    site_image: {type: String},
    site_url: {type: String},
    site_locale: {type: String},
    site_type: {type: String},
    gtm: {type: String},
    fb_app_id: {type: String},
    geo_region: {type: String},
    copyright: {type: String},
    google_site_verification: {type: String},
    charset: {type: String, uppercase: true},
    base_href: {type: String},
    language: {type: String, enum: ['vi_VN', 'en_US', 'en', 'vi']},
    page_size: {type: Number},
    values: {type: String},
    tags: {type: String},
    contents: {type: String},
    view_number: {type: Number},
    share_number: {type: Number},
    name: {type: String},
    alias: {type: String},
    created_by: {type: Schema.Types.Mixed},
    status: {type: Number},
    version: {type: String},
    author: {type: String},
    website: {type: String},
    description: {type: String},
    image: {type: String},
    contact: {type: String},
    logs: [{type: Schema.Types.Mixed}]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'crabJS_objects'
});

module.exports = mongoose.model('Objects', Objects);