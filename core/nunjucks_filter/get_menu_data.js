/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let Promise = require('bluebird');

function isAllow(list_acl, ref_permission) {
    if (list_acl.indexOf(ref_permission) != -1) {
        return true;
    } else {
        return false;
    }
}

function menuGenerator(listModules, menu, role) {
    let content = '';
    let node = listModules[menu].backend_menu;
    if (node) {
        if (node.menu) {
            let child = '';
            for (let i in node.menu) {
                if (node.menu.hasOwnProperty(i)) {
                    if (isAllow(role.values, node.menu[i].ref)) {
                        child += `<li><a class="link-active" href="${node.menu[i].link}"><i class="${node.menu[i].icon || 'fa fa-circle-o'}"></i>${node.menu[i].title}</a></li>`
                    }
                }
            }

            if (child) {
                content += `<li class="treeview">
        <a href="#"><i class="${node.icon}"></i> <span>${node.title}</span> <i class="fa fa-angle-left pull-right"></i></a>
        <ul class="treeview-menu">
            ${child}
        </ul>
      </li>`
            }
        } else {
            content += `<li><a href="${node.link}"><i class="${node.icon}"></i> <span>${node.title}</span></a></li>`
        }
    }

    return content;
}

let listModuleExtends = {};
module.exports = function (env) {
    env.addFilter('get_menu_data', function (group_name, user) {
        if (user) {
            if (group_name.indexOf(',') > -1) {
                let arr_group = group_name.split(',');
                let content = '';

                __models.Objects.findOne({_id: user.role_id}, {values: 1}, function (error, role) {
                    if (error) {
                        console.log('Find roles error!');
                    } else if (role) {
                        Promise.map(arr_group, function (group) {
                            content += `<li class="header">${group}</li>`;

                            //!(blog)
                            let moduleIgnore = '' || '*';
                            __.getGlobbedFiles(__base + `/administrator/modules/${moduleIgnore}/module.js`).forEach(function (path) {
                                require(path)(listModuleExtends);
                            });

                            for (let menu in listModuleExtends) {
                                if (listModuleExtends.hasOwnProperty(menu)) {
                                    if (listModuleExtends[menu].group == group) {
                                        content += menuGenerator(listModuleExtends, menu, role);
                                    }
                                }
                            }
                        }).then(function () {
                            __models.Users.findOne({_id: user._id}, {settings: 1}, function (err, user_info) {
                                if (err) {
                                    console.log('Caching user menu failed!')
                                }
                                user_info.settings = {
                                    menu: content,
                                    updated_at: new Date()
                                };
                                user_info.save();
                            });
                            return env.getFilter('safe')(content);
                        });
                    } else {
                        return '';
                    }
                });
            } else {
                let content = `<li class="header">${group_name}</li>`;

                __models.Objects.findOne({_id: user.role_id}, {values: 1}, function (error, role) {
                    if (error) {
                        console.log('Find roles error!');
                    }
                    //!(blog)
                    let moduleIgnore = '' || '*';
                    __.getGlobbedFiles(__base + `/administrator/modules/${moduleIgnore}/module.js`).forEach(function (path) {
                        require(path)(listModuleExtends);
                    });

                    for (let menu in listModuleExtends) {
                        if (listModuleExtends.hasOwnProperty(menu)) {
                            if (listModuleExtends[menu].group == group_name) {
                                content += menuGenerator(listModuleExtends, menu, role);
                            }
                        }
                    }
                });

                __models.Users.findOne({_id: user._id}, {settings: 1}, function (err, user_info) {
                    if (err) {
                        console.log('Caching user menu failed!')
                    }
                    user_info.settings = {
                        menu: content,
                        updated_at: new Date()
                    };
                    user_info.save();
                });

                return env.getFilter('safe')(content);
            }
        } else {
            return '';
        }
    })
};