/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

function bind(input, to) {
    $(input).on("input", function () {
        $(to).text(this.value);
    });
}
bind('#username', '#bind-username');
bind('#email', '#bind-email');
bind('#host', '#bind-host');
bind('#port', '#bind-port');
bind('#dbUsername', '#bind-dbUsername');
bind('#dbPassword', '#bind-dbPassword');
bind('#dbName', '#bind-dbName');