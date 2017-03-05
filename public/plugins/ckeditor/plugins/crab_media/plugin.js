/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

CKEDITOR.plugins.add('crab_media', {
    icon: 'timestamp',
    init: function (editor) {
        editor.addCommand('insertMedia', {
            exec: function (e) {
                var now = new Date();
                e.insertHtml('The current date and time is: <em>' + now.toString() + '</em>');
            }
        });
        editor.ui.addButton('crab_media', {
            label: 'CrabJS: Insert Media',
            command: 'insertMedia',
            toolbar: 'insert'
        });
    }
});