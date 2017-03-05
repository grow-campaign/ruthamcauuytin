/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

module.exports = function (module) {
    module.articles = {
        group: 'Hệ thống',
        title: 'Danh mục - Bài viết',
        author: 'Hai',
        version: '0.0.1',
        description: 'Quản lý danh mục bài viết / danh sách bài viết',
        backend_menu: {
            title: 'Bài viết',
            icon: 'fa fa-newspaper-o',
            menu: [
                {
                    title: 'Danh mục bài viết',
                    link: `/${__config.admin_prefix}/categories`,
                    icon: 'fa fa-tags',
                    ref: 'list_category'
                }, {
                    title: 'Xem tất cả bài viết',
                    link: `/${__config.admin_prefix}/posts`,
                    ref: 'list_article'
                }, {
                    title: 'Viết bài mới',
                    link: `/${__config.admin_prefix}/posts/create`,
                    ref: 'create_article'
                }
            ]
        }, roles: [
            {
                name: 'list_category',
                title: 'Xem tất cả danh mục'
            }, {
                name: 'create_category',
                title: "Tạo mới danh mục"
            }, {
                name: 'update_category',
                title: 'Cập nhật thông tin danh mục'
            }, {
                name: 'delete_category',
                title: 'Xóa danh mục'
            }, {
                name: 'list_article',
                title: 'Xem tất cả bài viết'
            }, {
                name: 'delete_article',
                title: 'Xóa bài viết'
            }, {
                name: 'create_article',
                title: 'Tạo mới bài viết'
            }, {
                name: 'update_article',
                title: 'Cập nhật nội dung bài viết'
            }
        ]
    };

    module.system = {
        group: 'Hệ thống',
        title: 'Hệ thống - Cấu hình',
        author: 'Hai',
        version: '0.0.1',
        description: 'Cấu hình hệ thống',
        backend_menu: {
            title: 'Cấu hình hệ thống',
            icon: 'fa fa-cog',
            menu: [
                {
                    title: 'Cấu hình website',
                    link: `/${__config.admin_prefix}/settings`,
                    ref: 'site_setting'
                }, {
                    title: 'Cài đặt modules',
                    link: `/${__config.admin_prefix}/modules/install`,
                    icon: 'fa fa-upload',
                    ref: 'install_module'
                }, {
                    title: 'Giao diện',
                    link: `/${__config.admin_prefix}/themes`,
                    icon: 'fa fa-leaf',
                    ref: 'install_theme'
                }, {
                    title: 'Widget',
                    link: `/${__config.admin_prefix}/widget`,
                    icon: 'fa fa-clone',
                    ref: 'widget_theme'
                }, {
                    title: 'Logs hệ thống',
                    link: `/${__config.admin_prefix}/logs`,
                    ref: 'system_logs'
                }
            ]
        }, roles: [
            {
                name: 'site_setting',
                title: 'Cấu hình website'
            }, {
                name: 'install_module',
                title: 'Cài đặt module'
            }, {
                name: 'install_theme',
                title: 'Cài đặt giao diện'
            }, {
                name: 'widget_theme',
                title: 'Widget'
            }, {
                name: 'view_system_logs',
                title: 'Xem logs của hệ thống'
            }, {
                name: 'delete_system_logs',
                title: "Xóa logs của hệ thống"
            }
        ]
    };

    module.users = {
        group: 'Hệ thống',
        title: 'Phân quyền - Quản lý người dùng',
        author: 'Hai',
        version: '0.0.1',
        description: 'Tạo, thêm - sửa -xóa thông tin các nhóm quyền. Quản lý tài khoản người dùng.',
        backend_menu: {
            title: 'Quản lý người dùng',
            icon: 'fa fa-user',
            menu: [
                {
                    title: 'Quản lý phân quyền',
                    link: `/${__config.admin_prefix}/roles`,
                    icon: 'fa fa-users',
                    ref: 'list_role'
                }, {
                    title: 'Danh sách tài khoản',
                    link: `/${__config.admin_prefix}/users`,
                    ref: 'list_user'
                }, {
                    title: 'Tạo tài khoản',
                    link: `/${__config.admin_prefix}/users/create`,
                    ref: 'create_user'
                }
            ]
        }, roles: [
            {
                name: 'list_role',
                title: 'Xem danh sách các nhóm quyền'
            }, {
                name: 'create_role',
                title: 'Tạo nhóm quyền mới'
            }, {
                name: 'view_role',
                title: 'Xem thông tin của nhóm quyền'
            }, {
                name: 'update_role',
                title: 'Cập nhật quyền hạn của nhóm quyền'
            }, {
                name: 'delete_role',
                title: 'Xóa nhóm quyền người dùng'
            }, {
                name: 'list_user',
                title: 'Xem danh sách người dùng'
            }, {
                name: 'delete_user',
                title: 'Xóa tài khoản người dùng'
            }, {
                name: 'create_user',
                title: 'Tạo mới tài khoản'
            }, {
                name: 'update_user',
                title: 'Cập nhật thông tin người dùng'
            }, {
                name: 'view_user_profile',
                title: 'Xem thông tin người dùng khác'
            }, {
                name: 'block_user',
                title: 'Khóa tài khoản người dùng'
            }
        ]
    };

    return module;
};
