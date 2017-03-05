/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let home = require('./controllers');

module.exports = function (app) {
    app.route('/').get(home.index);
    app.route('/lien-he').get(home.contact)
	app.route('/gioi-thieu').get(home.introduction)
	app.route('/danh-muc/:category_alias').get(home.view_category)
	app.route('/:category_alias/:article_alias').get(home.view_article_details)
};