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
    _module = new __viewRender('backend', module_name),
    Promise = require('bluebird');

_module.list = function (req, res) {

    let structure = [
        {
            column: '_id',
            width: '1%',
            header: ''
        }, {
            column: 'display_name',
            width: '22%',
            header: 'Họ tên'
        }, {
            column: 'email',
            width: '22%',
            header: 'Email'
        }, {
            column: 'type',
            width: '20%',
            header: 'Loại tài khoản',
            type: {
                name: 'select',
                values: {
                    '0': 'Quản trị',
                    '-1': 'Người dùng'
                }
            }
        }, {
            column: 'last_login_date',
            width: '20%',
            header: 'Đăng nhập',
            type: 'date-range',
            buttonClass: 'fa fa-calendar'
        }, {
            column: 'status',
            width: '13%',
            header: 'Trạng thái',
            type: {
                name: 'select',
                values: {
                    'Available': 'Kích hoạt',
                    'Block': 'Khóa',
                    'Pending': 'Chờ kích hoạt'
                }
            }
        }
    ];

    let toolbar = new __.Toolbar();
    toolbar.custom({
        refreshButton: {link: `/${__config.admin_prefix}/users`},
        createButton: {access: true, link: `/${__config.admin_prefix}/users/create`, text: ' Tạo tài khoản'},
        searchButton: {},
        deleteButton: {access: true} // isAllow
    });

    res.locals.tableColumns = structure;

    let filter = __.createFilter(req, res, 'users', {order_by: 'created_at', order_type: 'desc'});

    let cond = __.verifyCondition(req.query, {
        display_name: 'string',
        email: 'string',
        type: 'boolean',
        last_login_date: 'date',
        status: 'boolean'
    });

    Promise.all([
        __models.Users.count(cond, function (err, count) {
            return count;
        }),
        __models.Users.find(cond)
            .populate('role_id', 'name')
            .sort(filter.sort)
            .limit(__config.page_size)
            .skip((filter.page - 1) * __config.page_size)
            .exec(function (err, users) {
                return users;
            })
    ]).then(function (results) {
        _module.render(req, res, 'users/index', {
            title: 'Quản lý người dùng',
            toolbar: toolbar.render(),
            users: results[1],
            totalPage: Math.ceil(results[0] / __config.page_size),
            currentPage: filter.page,
            order_by: filter.order_by,
            order_type: filter.order_type
        })
    }).catch(function (error) {
        __.logger.error(error);
        req.flash('danger', 'Có lỗi xảy ra khi truy cập danh sách người dùng!');
        return res.redirect(`/${__config.admin_prefix}/dashboard`);
    });
};

_module.view = function (req, res) {
    __models.Objects.find({
        key: 'objects:roles',
        status: 0
    }, {name: 1}).sort({created_at: -1}).exec(function (error, roles) {
        if (error) {
            __.logger.error(error);
            return _module.render_error(req, res, '500');
        }
        __models.Users.findOne({_id: req.params.id}, function (err, profile) {
            if (err) {
                __.logger.error(err);
                return _module.render_error(req, res, '500');
            } else if (!profile || !profile._id) {
                __.logger.warn(`Warning > Wrong parameter url: ${res.locals.route}`);
                return _module.render_error(req, res, '404');
            } else {
                return _module.render(req, res, 'users/view_profile', {
                    title: `Thông tin tài khoản: ${profile.display_name}`,
                    profile: profile,
                    roles: roles
                })
            }
        })
    });
};

_module.create = function (req, res) {
    _module.render(req, res, 'users/create_profile', {
        title: 'Tạo tài khoản mới',
        create: true
    })
};

_module.checkExistEmail = function (req, res) {
    __models.Users.findOne({email: req.body.email}, {email: 1}, function (err, re) {
        if (err) {
            return res.jsonp({
                status: 500,
                message: err
            })
        } else if (re) {
            return res.jsonp({
                status: 100,
                message: 'Not Available'
            })
        } else {
            return res.jsonp({
                status: 200,
                message: 'Available'
            })
        }
    })
};

_module.created = function (req, res) {

    let formidable = require('formidable');

    let form = new formidable.IncomingForm();
    form.uploadDir = require('path').resolve(__base, 'public', 'uploads', 'images');

    form.parse(req, function (err, fields, files) {
        if (err) {
            return _module.render_error(req, res, '500');
        }
        req.body = fields || {};

        var file = files['avatar_user'];

        var file_type = file.name.split('.').pop();

        var new_file_name = __.randomText(12) + '_' + new Date().getTime() + '.' + file_type;

        var file_path = require('path').join(form.uploadDir, new_file_name);

        require('fs').rename(file.path, file_path);

        req.body.avatar = '/uploads/images/' + new_file_name;

        req.body.token = 'nothing';
        req.body.password = __models.Users.generateHash(req.body.password);
        var newUser = __models.Users(req.body);
        newUser.save(function (err) {
            if (err) {
                __.logger.error(err);
                req.flash('danger', 'Có lỗi xảy ra!');
            } else {
                req.flash('success', 'Tạo mới tài khoản thành công!');
                res.redirect(`/${__config.admin_prefix}/users`);
            }
        });
    });
};

_module.update = function (req, res) {
    let formidable = require('formidable');

    let form = new formidable.IncomingForm();
    form.uploadDir = require('path').resolve(__base, 'public', 'uploads', 'images');

    form.parse(req, function (err, fields, files) {
        if (err) {
            return _module.render_error(req, res, '500');
        }
        req.body = fields || {};

        var file = files['avatar_user'];

        if (file.size) {
            var file_type = file.name.split('.').pop();

            var new_file_name = __.randomText(12) + '_' + new Date().getTime() + '.' + file_type;

            var file_path = require('path').join(form.uploadDir, new_file_name);

            require('fs').rename(file.path, file_path);

            req.body.avatar = '/uploads/images/' + new_file_name;
        }


        if (req.body.password && req.body.password.trim()) {
            req.body.password = __models.Users.generateHash(req.body.password);
        } else {
            delete req.body.password;
        }

        if (req.body.type == -1) req.body.role_id = null;
        __models.Users.findByIdAndUpdate(req.params.id, req.body, {
            select: '_id'
        }, function (err, re) {
            if (err) {
                __.logger.error(err);
                return _module.render_error(req, res, '500');
            }

            // Update data other collections
            __models.Posts.update({authors: {$exists: true}, 'authors._id': re._id},
                {'authors.display_name': req.body.display_name}, {
                    upsert: false,
                    multi: true
                }).exec(function (err, re) {
                if (err) {
                    __.logger.error(err);
                    return _module.render_error(req, res, '500');
                }

                req.flash('success', 'Cập nhật thông tin tài khoản thành công!');
                res.redirect(`/${__config.admin_prefix}/users/view/${req.params.id}`);
            });
        });


    });
};

_module.api_update = function (req, res) {
    __models.Users.update({_id: req.params.id}, req.body).exec(function (err, re) {
        if (err) {
            return res.jsonp({
                status: 500,
                message: err
            })
        }
        return res.jsonp({
            status: 200
        })
    })
};

_module.change_pass = function (req, res) {
    __models.Users.findOne({
        _id: req.body.user_id
    }).exec(function (err, user) {
        if (err) {
            res.send({
                status: 500,
                content: 'Có lỗi xảy ra!'
            })
        }
        if (user.validPassword(req.body.old_pass)) {
            __models.Users.update({_id: req.body.user_id}, {
                password: __models.Users.generateHash(req.body.new_pass)
            }).exec(function (err, re) {
                if (err) {
                    res.send({
                        status: 500,
                        content: 'Có lỗi xảy ra!'
                    })
                } else {
                    res.send({
                        status: 200,
                        content: 'Mật khẩu của bạn đã được thay đổi thành công!'
                    })
                }
            })
        } else {
            res.send({
                status: 401,
                content: 'Mật khẩu cũ chưa chính xác. Vui lòng kiểm tra lại!'
            })
        }
    });
};

_module.delete = function (req, res) {
    __models.Users.remove({_id: {$in: req.body.ids}})
        .exec(function (err) {
            if (err) {
                __.logger.error(err);
                req.flash('danger', 'Có lỗi xảy ra khi thực hiện xóa thông tin người dùng!');
                res.sendStatus(200);
            }
            req.flash('success', 'Xóa tài khoản thành công!');
            res.sendStatus(200);
        })
};

_module.delete_cache = function (req, res) {

    function dateFormat(input) {
        var t = new Date(input);
        var date = [String('00' + t.getDate()).slice(-2), String('00' + (t.getMonth() + 1)).slice(-2), t.getFullYear()];
        return date.join('/');
    }

    let isAdmin = false;
    if (req.user.email == __config.admin_email) {
        isAdmin = true;
    }


    if (req.user._id == req.params.id || isAdmin) {
        __models.Users.findOne({_id: req.params.id}, {settings: 1, role_id: 1}, function (error, user) {
            if (error) {
                __.logger.error(error);
                req.flash('danger', 'Có lỗi xảy ra khi thực hiện xóa cache của tài khoản này.');
                res.sendStatus(200);
            }
            user.settings.menu = '';
            user.save();

            let msg = '';
            if (isAdmin && !(req.user._id == req.params.id)) {
                msg = `Khởi tạo Cache cho người dùng thành công. Ngày cập nhật: ${dateFormat(user.settings.updated_at)}!`;
                req.flash('warning', msg);
                res.sendStatus(200);
            } else {
                msg = `Dữ liệu Cache từ ngày ${dateFormat(user.settings.updated_at)} trên tài khoản của bạn đã được xóa!<br>
                        Vui lòng tải lại trang. <a style="text-decoration: none" href="javascript:location.reload()"><span class="label label-warning"><i class="fa fa-refresh fa-spin fa-fw"></i>Tải lại</span></a>`;
                req.flash('success', msg);
                res.sendStatus(200);
            }
        })
    }
};

_module.reSendUserActivation = function (req, res) {

};

module.exports = _module;