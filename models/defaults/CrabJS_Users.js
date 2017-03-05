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
    Schema = require('mongoose').Schema,
    bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
let userSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String},
    password: {type: String, required: true},
    avatar: {type: String},
    token: {type: String, required: true},
    display_name: {type: String, required: true},
    last_login_date: {type: Schema.Types.Date, default: Date.now},
    rules: {type: Schema.Types.Mixed, default: {}},
    settings: {
        updated_at: {type: Schema.Types.Date, default: Date.now},
        menu: {type: String}
    },
    status: {type: String, enum: ['Available', 'Block', 'Pending']},
    created_date: {type: Schema.Types.Date, default: Date.now},
    role_id: {type: Schema.Types.ObjectId, ref: 'Objects'},
    type: {type: Schema.Types.Number, enum: [0, -1]},
    activation_code: {type: String},
    reset_password_token: {type: String},
    reset_password_expires: {type: Schema.Types.Date},
    logs: [{type: Schema.Types.Mixed}],
    web_session: [{
        session_id: {type: String},
        ip_address: {type: String},
        user_agent: {type: String},
        created_at: {type: Schema.Types.Date, default: Date.now}
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'crabJS_users'
});

userSchema.static('generateHash', function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function (password) {
    if (this.password.split('$').length === 4) {
        return bcrypt.compareSync(password, this.password);
    } else {
        return false;
    }
};

module.exports = mongoose.model('Users', userSchema);