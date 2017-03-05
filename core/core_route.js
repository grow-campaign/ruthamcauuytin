/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";
let rand = require('csprng');
let passport = require('passport'),
    loginModule = new __viewRender('backend', 'mod_auth');

let formidable = require('formidable');
var firebase = require("firebase");


module.exports = function (app) {

    /**
     * @return {string}
     */
    function FixName(file_name) {
        var res = '';
        if (file_name) {
            res = file_name.replace(/\\/g, '');
            res = res.replace(/\/\//g, '/');
            res = res.replace(':/', '://');
        }
        return res;
    }

    /**
     * @return {string}
     */
    function GetFileExt(path) {
        var res = '';
        path = haiRE.GetFileName(path);
        if (path.indexOf('.') > -1) {
            res = path.substring(path.lastIndexOf('.') + 1);
        }
        return res;
    }

    /**
     * @return {string}
     */
    function FixPath(path) {
        var res = '';
        if (path) {
            res = path.replace(/\\/g, '');
            res = res.replace(/\/\//g, '/');
            res = res.replace(':/', '://');
        }
        return res;
    }

    app.route('/api/remove/media').post(function (req, res) {
        let fs = require('fs');

        __models.Media.remove({path: req.body.name}).exec(function(err){
            if (!err){
                fs.unlink(__base + '/public' + req.body.name, function (err) {
                    if (err){
                        res.send({
                            status: 500
                        })
                    } else {
                        res.send({
                            status: 200
                        })
                    }
                });
            } else {
                res.send({
                    status: 200
                })
            }
        });
    });

    app.route('/api/upload').post(function (req, res) {

        var file_path, file_name, new_file_name;

        var form = new formidable.IncomingForm();

        form.multiples = false;

        req.query.path = FixPath(req.query.path).split('/')[FixPath(req.query.path).split('/') - 1];

        if (req.query && req.query.server && req.query.path) {
            form.uploadDir = '/home' + req.query.path;

            var stats = require('fs').lstatSync(form.uploadDir);

            if (!stats.isDirectory()) {
                require('fs').mkdir('/home/' + req.query.path, function (err) {
                    if (err) {
                        __logger.error(err);
                    }
                })
            }

        } else if (req.query && req.query.path) {
            form.uploadDir = require('path').resolve(__base, 'public', req.query.path);
        } else {
            form.uploadDir = require('path').resolve(__base, 'public', 'media');
        }

        form.on('file', function (field, file) {

            file_name = FixName(file.name);

            new_file_name = `${file_name.split('.')[0]}_${Date.now()}.${file_name.split('.')[1]}`;

            require('fs').rename(file.path, require('path').join(form.uploadDir, new_file_name));
            file_path = require('path').join(form.uploadDir, new_file_name);
        });

        form.on('error', function (err) {
            if (err) {
                res.send({
                    status: 500,
                    message: err
                })
            }
        });

        form.on('end', function () {
            res.send({
                status: 200,
                data: {
                    path: file_path,
                    file_name: new_file_name
                }
            });
        });

        form.parse(req);
    });

    app.route('/upload').post(function (req, res) {
        var file_path = '';
        var file_name = '';
        var new_file_name = '';

        var form = new formidable.IncomingForm();

        form.multiples = true;

        form.uploadDir = require('path').resolve(__base, 'public', 'media');

        form.on('file', function (field, file) {

            file_name = FixName(file.name);

            new_file_name = `${file_name.split('.')[0]}_${Date.now()}.${file_name.split('.')[1]}`;

            require('fs').rename(file.path, require('path').join(form.uploadDir, new_file_name));
            file_path = require('path').join(form.uploadDir, new_file_name);
        });

        form.on('error', function (err) {
            if (err) {
                console.log(`An error file upload ${err}`);
                __.logger.error(`An error file upload ${err}`);
            }
        });

        form.on('end', function () {
            let newMedia = new __models.Media({
                path: '/media/' + new_file_name,
                user_id: {
                    _id: req.user._id,
                    display_name: req.user.display_name
                }
            });

            newMedia.save(function (err, re) {
                if (!err) {
                    res.send({
                        status: 200,
                        messages: 'success',
                        path: file_path,
                        file_name: new_file_name,
                        created_at: re.created_at
                    });
                }
            });
        });

        form.parse(req);
    });

    app.route('/post/list/media').post(function (req, res) {
        let page_size = 20;
        let skip = req.body.page * page_size;
        __models.Media.find({}).sort({created_at: -1}).limit(page_size).skip(skip).exec(function (error, result) {
            if (error) {
                res.send({
                    status: 500,
                    data: "Something wrong broken!"
                })
            }
            res.send({
                status: 200,
                data: result
            })
        });
    });

    app.route('/get/list/media').get(function (req, res) {
        __models.Media.find({}).sort({created_at: -1}).limit(20).exec(function (error, result) {
            if (error) {
                res.send({
                    status: 500,
                    data: "Something wrong broken!"
                })
            }
            res.send({
                status: 200,
                data: result
            })
        });
    });

    /**
     * Passport strategies AdminLogin
     * Check authentication
     */
    app.route(`/login.crab`).get(function (req, res, next) {
        if (req.isAuthenticated() && req.user) {
            return next();
        }
        loginModule.render(req, res, 'login')
    }, function (req, res) {
        res.redirect(`/${__config.admin_prefix}/dashboard`);
    }).post(passport.authenticate('AdminLogin', {
        failureRedirect: `/login.crab`,
        failureFlash: true,
        successRedirect: `/${__config.admin_prefix}/dashboard`
    }));

    /**
     * Passport strategies google login
     */
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.profile.emails.read']
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: `/${__config.admin_prefix}/dashboard`,
            failureFlash: true,
            failureRedirect: '/login.crab'
        }));

    /**
     * Passport strategies facebook login
     */
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: `/${__config.admin_prefix}/dashboard`,
            failureFlash: true,
            failureRedirect: '/login.crab'
        }));

    /**
     * Unforgotten token user account
     */

    app.route('/unforgotten/token/:token').get(function (req, res) {
        __models.Users.findOne({reset_password_token: req.params.token}, {
            reset_password_token: 1
        }, function (error, user) {
            if (error) {
                req.flash('error', "Something wrong broken for your action.");
                return res.redirect(`/login.crab`);
            }
            if (user) {
                user.reset_password_token = 'unforgotten';
                user.save();
                req.flash('info', "An access token remove successful.");
                return res.redirect(`/login.crab`);
            } else {
                req.flash('error', "Access token is not valid or has expired.");
                return res.redirect(`/login.crab`)
            }
        })
    });

    app.route('/forgot/:token').get(function (req, res) {
        __models.Users.findOne({
            status: {$nin: [-1, -2]},
            reset_password_expires: {$gt: Date.now()},
            reset_password_token: req.params.token
        }, {
            email: 1, display_name: 1, reset_password_token: 1, reset_password_expires: 1
        }, function (err, user) {
            if (user) {
                loginModule.render(req, res, 'change_password', {
                    email: user.email
                });
            } else {
                req.flash('error', "The link you followed expired. Please restart the password reset flow.");
                return res.redirect(`/forgot_password.crab`);
            }
        })
    }).post(function (req, res) {
        __models.Users.findOne({
            status: {$nin: [-1, -2]},
            reset_password_expires: {$gt: Date.now()},
            reset_password_token: req.params.token
        }, {email: 1, display_name: 1, reset_password_token: 1, reset_password_expires: 1}, function (err, user) {
            if (err) {
                req.flash('error', "That's not true. Hmm, something broken for your action. Contact: hai@100dayproject.org ");
                return res.redirect(`/forgot_password.crab`);
            }
            if (user) {
                user.password = user.generateHash(req.body.password);
                user.reset_password_token = '';
                user.save(function (err, re) {
                    if (re) {
                        loginModule.render(req, res, 'email_template/notify_password_change', {
                            display_name: user.display_name
                        }, function (err, emailHTML) {
                            __.send_email(user.email, '[100dayproject] Your password has changed', emailHTML, function (err, re) {
                                if (err) {
                                    __.logger.error(err);
                                }
                            });
                        });
                        req.flash('info', 'Your password has been successfully reset!');
                        return res.redirect(`/login.crab`);
                    }
                    req.flash('error', 'Change password failed!');
                    return res.redirect(`/login.crab`);
                });

            } else {
                req.flash('error', "The link you followed expired. Please restart the password reset flow.");
                return res.redirect(`/forgot_password.crab`);
            }
        })
    });

    /**
     * Passport strategies ForgotPassword
     * Forgot password account
     */

    app.route(`/forgot_password.crab`).get(function (req, res) {
        loginModule.render(req, res, 'forgot_password');
    }).post(function (req, res) {
        let title = 'Reset Your 100dayproject ID Password';
        let token = rand(160, 36);
        token += Date.now();
        let expires = Date.now() + 3600000 * 2;
        let email = req.body.email.toLocaleLowerCase().trim();

        __models.Users.findOne({
            email: email,
            status: {$ne: 'Block'}
        }, {email: 1, display_name: 1}, function (err, user) {
            if (err) {
                req.flash('error', 'Có lỗi xảy ra khi thực hiện thay đổi mật khẩu!');
                return res.redirect(`/forgot_password.crab`);
            }
            if (user) {
                user.reset_password_token = token;
                user.reset_password_expires = expires; // 1 hour
                user.save();

                loginModule.render(req, res, 'email_template/user_forgot_password', {
                    display_name: user.display_name,
                    token: token
                }, function (err, emailHTML) {
                    if (err) {
                        res.send({
                            status: 500,
                            message: "Something wrong broken for your action."
                        });
                        // req.flash('error', "Something wrong broken for your action.");
                        // return res.redirect(`/forgot_password.crab`);
                    } else {
                        __.send_email(email, title, emailHTML, function (err, re) {
                            if (err) {
                                res.send({
                                    status: 500,
                                    message: "Something wrong broken for your action."
                                });
                                // req.flash('error', "Something wrong broken for your action.");
                                // return res.redirect(`/forgot_password.crab`);
                            }
                            else {
                                res.send({
                                    status: 200,
                                    message: "OK. We've sent you an email describing how to reset your password."
                                });
                                // req.flash('success', "OK. We've sent you an email describing how to reset your password.");
                                // return res.redirect(`/forgot_password.crab`);
                            }
                        });
                    }
                });
            } else {
                res.send({
                    status: 304,
                    message: "No email / password account exists with the provided email."
                });
                // req.flash('error', "No email / password account exists with the provided email.");
                // return res.redirect(`/forgot_password.crab`);
            }
        })
    });

    /**
     * Sign out account and destroy session
     */
    app.route(`/logout`).get(function (req, res) {

        var refUser = firebase.database().ref('users/' + req.user._id +'/connections');
        refUser.set(null);

        __models.Users.findByIdAndUpdate(req.user._id, {
            $pull: {web_session: {session_id: req.sessionID}  }
        }).exec(function(err) {
            console.log("LOGOUT ERROR: ", err);
        });
        res.clearCookie('100dayproject', {path: '/'});
        req.logout();
        req.session.destroy();
        res.redirect(`/`);
    });

    /**
     * Middleware get user account information
     */
    app.get('*', function (req, res, next) {
        let fs = require('fs'),
            path = require('path');

        var files = fs.readdirSync(__base + '/config/firebase');

        if (path.extname(files[0]) === '.json') {
            if (firebase.apps.length == 0) {
                firebase.initializeApp({
                    databaseURL: 'https://crab-cms.firebaseio.com',
                    serviceAccount: __base + '/config/firebase/' + files[0]
                });
            }
            if (req.user) {
                res.locals.fb_token = firebase.auth().createCustomToken(`${req.user._id}`);
            }
        }

        res.locals.user = req.user;
        next();
    });

    app.use(`/${__config.admin_prefix}(/)?`, function (req, res, next) {
        if (!req.isAuthenticated() || !req.user) {
            return res.redirect(`/login.crab`);
        }
        next();
    });
};