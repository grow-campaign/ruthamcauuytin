/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

module.exports = function (env) {
    env.addFilter('get_theme', function (fileLoader, layer) {
        if (layer.toLowerCase().trim() === 'backend') {
            return `${__base}/administrator/templates/${__config.theme}/${fileLoader}`;
        } else {
            return `${__base}/templates/${__config.theme}/${fileLoader}`;
        }
    })
};