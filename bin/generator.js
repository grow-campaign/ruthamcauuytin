/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let inquirer = require('inquirer'),
    pkg = require('../package.json'),
    __ = require('../libraries/global_function');

let questions = [{
    type: 'input',
    message: `Site name`,
    name: 'name',
    default: function () {
        return pkg.name
    }
}, {
    type: 'input',
    message: `Site description`,
    name: 'description',
    default: function () {
        return pkg.description
    }
}, {
    type: 'input',
    message: `Site keywords`,
    name: 'keywords',
    default: function () {
        return pkg.keywords
    }
}, {
    type: 'input',
    message: `Language`,
    name: 'language',
    default: function () {
        return pkg.crabJS.language
    }
}, {
    type: 'input',
    message: `Port listen to`,
    name: 'port',
    default: function () {
        return pkg.crabJS.port
    }
}, {
    type: 'input',
    message: `Admin router`,
    name: 'admin_prefix',
    default: function () {
        return pkg.crabJS.admin_prefix
    }
}, {
    type: 'checkbox',
    message: 'Initialize modules',
    name: 'modules',
    choices: [
        new inquirer.Separator(' = Select default modules for project = '),
        {
            name: 'mod_google_analytics',
            checked: true
        },
        {
            name: 'mod_articles'
        },
        {
            name: 'mod_seo',
            checked: true
        }
    ]
}, {
    type: 'input',
    message: 'Default theme settings',
    name: 'theme',
    default: function () {
        return pkg.crabJS.theme
    }
}, {
    type: 'confirm',
    name: 'settings',
    message: 'Do you like settings?'
}, {
    type: 'confirm',
    name: 'browsers',
    message: 'Open web browsers to configuration database.?'
}];

inquirer.prompt(questions).then(function (re) {
    if (re.settings) {

        let runServer = false;
        if (re.settings && re.browsers) {
            runServer = true;
        }
        delete re.settings;
        delete re.browsers;

        console.log(JSON.stringify(re, null, 2));

        __.writeFile(__base + `${require('path').sep}config${require('path').sep}config.json`, JSON.stringify(re, null, 2));
        if (runServer) {
            __.logger.info("OK! That's this, server running...");
            require('../install/web');
        } else {
            process.exit(0);
        }
    } else {
        console.log("\nConfiguration warning!!");
    }
});
