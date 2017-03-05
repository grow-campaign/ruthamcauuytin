/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let module_name = 'default_cms',
    _module = new __viewRender('backend', module_name);

_module.list = function (req, res) {
    let structure = [
        {
            column: '_id',
            width: '1%',
            header: ''
        }, {
            column: 'level',
            width: '15%',
            header: 'Level',
            type: {
                name: 'select',
                values: {
                    Error: 'Error',
                    Danger: 'Danger',
                    Warning: 'Warning',
                    Info: 'Info',
                    Debug: 'Debug'
                }
            }
        }, {
            column: 'category',
            width: '15%',
            header: 'Category',
            type: {
                name: 'select',
                values: {
                    UI: 'UI',
                    DAO: 'DAO',
                    BUS: 'BUS',
                    SYSTEM: 'SYSTEM'
                }
            }
        }, {
            column: 'message',
            width: '25%',
            header: 'Message'
        }, {
            column: 'user_id.display_name',
            width: '20%',
            header: 'User Action'
        }, {
            column: 'created_at',
            width: '15%',
            header: 'Created At',
            type: 'date-range',
            buttonClass: 'fa fa-calendar',
            condition: {
                type: 'none'
            }
        }
    ];

    let toolbar = new __.Toolbar();
    toolbar.custom({
        refreshButton: {link: `/${__config.admin_prefix}/logs`},
        searchButton: {},
        deleteButton: {access: true} // isAllow
    });

    res.locals.tableColumns = structure;

    let cond = __.verifyCondition(req.query, {
        level: 'boolean',
        category: 'boolean',
        "user_id.display_name": 'string',
        column: 'date'
    });

    let filter = __.createFilter(req, res, 'logs', {order_by: 'created_at', order_type: 'desc'});

    Promise.all([
        __models.Logs.count(cond, function (err, count) {
            return count;
        }),
        __models.Logs.find(cond).sort(filter.sort).limit(__config.page_size).skip((filter.page - 1) * __config.page_size)
            .exec(function (err, posts) {
                return posts;
            })
    ]).then(function (results) {
        _module.render(req, res, 'logs/index', {
            title: 'CrabJS | Logs System Manager',
            toolbar: toolbar.render(),
            logs: results[1],
            totalPage: Math.ceil(results[0] / __config.page_size),
            currentPage: filter.page,
            order_by: filter.order_by,
            order_type: filter.order_type
        })
    }).catch(function (error) {
        __.logger.error(error);
        req.flash('danger', 'Có lỗi xảy ra khi truy cập logs hệ thống!');
        return res.redirect(`/${__config.admin_prefix}/dashboard`);
    });
};

_module.delete = function (req, res) {
    __models.Logs.remove({_id: {$in: req.body.ids}})
        .exec(function (err) {
            if (err) {
                __.logger.error(err);
                req.flash('danger', 'Có lỗi kiểm tra!');
                res.sendStatus(200);
            } else {
                req.flash('success', 'Xóa logs hệ thống thành công!');
                res.sendStatus(200);
            }
        })
};


module.exports = _module;