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

_module.create = function (req, res) {
    let toolbar = new __.Toolbar();
    toolbar.custom({
        backButton: {link: `/${__config.admin_prefix}/roles`},
        saveButton: {access: true}
    });

    var listModuleExtends = {};
    __.getGlobbedFiles(__base + `/administrator/modules/*/module.js`).forEach(function (path) {
        require(path)(listModuleExtends);
    });

    let modules = [];

    for (let md in listModuleExtends) {
        if (listModuleExtends.hasOwnProperty(md)) {
            if (listModuleExtends[md].roles) {
                modules.push(listModuleExtends[md]);
            }
        }
    }

    _module.render(req, res, 'roles/view', {
        title: 'Tạo nhóm quyền mới',
        toolbar: toolbar.render(),
        modules: modules
    });
};

_module.created = function (req, res) {
    let acl = [];
    Object.keys(req.body).forEach(function (i) {
        if (i !== 'name' && i !== 'status' && i !== 'created_by') {
            acl.push(i);
        }
    });

    req.body.key = 'objects:roles';
    req.body.values = JSON.stringify(acl);
    req.body.created_by = {
        _id: req.user._id,
        display_name: req.user.display_name
    };

    var newRole = new __models.Objects(req.body);
    newRole.save(function (err) {
        if (err) {
            __.logger.error(err);
            req.flash('danger', 'Có lỗi xảy ra!');
        } else {
            req.flash('success', 'Tạo mới nhóm quyền thành công!');
            res.redirect(`/${__config.admin_prefix}/roles`);
        }
    });
};

_module.list = function (req, res) {

    let structure = [
        {
            column: '_id',
            width: '1%',
            header: ''
        }, {
            column: 'name',
            width: '25%',
            header: 'Tên nhóm quyền'
        }, {
            column: 'created_by.display_name',
            width: '15%',
            header: 'Người tạo'
        }, {
            column: 'created_at',
            width: '15%',
            header: 'Ngày tạo',
            type: 'date-range',
            buttonClass: 'fa fa-calendar'
        }, {
            column: 'status',
            width: '15%',
            header: 'Trạng thái',
            type: {
                name: 'select',
                values: {
                    '0': 'Kích hoạt',
                    '-1': 'Bản nháp'
                }
            }
        }
    ];
    /**
     * Toolbar call and render element
     * Access authentication call isAllow for check permission
     */
    let toolbar = new __.Toolbar();
    toolbar.custom({
        createButton: {access: true, link: `/${__config.admin_prefix}/roles/create`},
        refreshButton: {link: `/${__config.admin_prefix}/roles`},
        searchButton: {},
        deleteButton: {access: true} // isAllow
    });
    res.locals.tableColumns = structure;

    let cond = __.verifyCondition(req.query, {
        key: 'objects:roles',
        name: 'string',
        'created_by.display_name': 'string',
        created_at: 'date',
        status: 'boolean'
    });

    let filter = __.createFilter(req, res, 'roles', {order_by: 'created_at', order_type: 'desc'});

    Promise.all([
        __models.Objects.count(cond, function (err, count) {
            return count;
        }),
        __models.Objects.find(cond).sort(filter.sort).limit(__config.page_size).skip((filter.page - 1) * __config.page_size)
            .exec(function (err, roles) {
                return roles;
            })
    ]).then(function (results) {
        _module.render(req, res, 'roles/index', {
            title: 'Danh sách quyền',
            toolbar: toolbar.render(),
            roles: results[1],
            totalPage: Math.ceil(results[0] / __config.page_size),
            currentPage: filter.page,
            order_by: filter.order_by,
            order_type: filter.order_type
        })
    }).catch(function (error) {
        __.logger.error(err);
        return _module.render(req, res, '500');
    });
};

_module.update = function (req, res) {
    let acl = [];
    Object.keys(req.body).forEach(function (i) {
        if (i !== 'name' && i !== 'status' && i !== 'created_by') {
            acl.push(i);
        }
    });

    req.body.values = JSON.stringify(acl);

    for (let i in req.body) {
        if (req.body.hasOwnProperty(i) && i !== 'status' && i !== 'name' && i !== 'values') {
            delete req.body[i]
        }
    }

    __models.Objects.update({key: 'objects:roles', _id: req.params.id}, req.body).exec(function (err, re) {
        if (err) {
            __.logger.error(err);
            return _module.render_error(req, res, '500');
        }
        req.flash('success', 'Cập nhật thông tin quyền thành công!');
        res.redirect(`/${__config.admin_prefix}/roles/view/${req.params.id}`);
    });
};

_module.view = function (req, res) {
    let toolbar = new __.Toolbar();
    toolbar.custom({
        backButton: {link: `/${__config.admin_prefix}/roles`},
        saveButton: {access: true}
    });


    var listModuleExtends = {};
    __.getGlobbedFiles(__base + `/administrator/modules/*/module.js`).forEach(function (path) {
        require(path)(listModuleExtends);
    });

    let modules = [];

    for (let md in listModuleExtends) {
        if (listModuleExtends.hasOwnProperty(md)) {
            if (listModuleExtends[md].roles) {
                modules.push(listModuleExtends[md]);
            }
        }
    }

    __models.Objects.findOne({key: 'objects:roles', _id: req.params.id}, {
        values: 1,
        name: 1,
        status: 1
    }).exec(function (err, acl) {
        if (err) {
            __.logger.error(err);
            return _module.render_error(req, res, '500');
        } else if (acl) {
            _module.render(req, res, 'roles/view', {
                title: acl.name,
                toolbar: toolbar.render(),
                modules: modules,
                acl: acl
            });
        } else{
            return _module.render_error(req, res, '404');
        }
    });
};

_module.delete = function (req, res) {
    let user_refer = '<br>';
    __models.Users.find({role_id: {$in: req.body.ids}}, {role_id: 1, display_name: 1}, function (error, users) {
        if (users.length) {
            users.forEach(function (user) {
                user_refer += `• ${user.display_name}<br>`;
            });
            req.flash('warning', `Nhóm quyền đang được sử dụng cho ${users.length} tài khoản!${user_refer}`);
            res.sendStatus(200);
        } else {
            __models.Objects.remove({key: 'objects:roles', _id: {$in: req.body.ids}})
                .exec(function (err) {
                    if (err) {
                        __.logger.error(err);
                        req.flash('danger', 'Có lỗi xảy ra khi thực hiện xóa nhóm quyền hạn này!');
                        res.sendStatus(200);
                    } else {
                        req.flash('success', 'Xóa nhóm quyền thành công!');
                        res.sendStatus(200);
                    }
                })
        }
    });
};

module.exports = _module;