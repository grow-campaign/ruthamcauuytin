/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    winston = require('winston'),
    moment = require('moment');
let i1n8 = require('./helpers/i18n');
var ObjProto = Object.prototype,
    self = this;

// Regular expression that checks for hex value
exports.ObjectId = new RegExp("^[0-9a-fA-F]{24}$");

/**
 * Add prototype
 * @returns {*}
 */
String.prototype.toObjectId = function () {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};

exports.loginTracking = function (objects) {
    let newLog = new __models.LoginTracking(objects);

    newLog.save(function (err) {
        if (err) {
            console.log("LoginTracking: " + err);
        }
    })
};

exports.randomText = function (length, specialCharacter) {
    if (!length) {
        length = 128;
    }
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if (specialCharacter) {
        possible = '!@#$%^&*()-=' + possible + '!@#$%^&*()-=';
    }

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

exports.validObjectId = function () {
    return function (req, res, next) {

        let error_msg = "Truy cập chưa được xác thực.";

        if (req.params.id) {
            if (self.ObjectId.test(req.params.id)) {
                next();
            } else {
                if (req.xhr) {
                    return res.jsonp({
                        status: 400,
                        message: error_msg
                    })
                } else {
                    req.flash('danger', error_msg);
                    return res.redirect('/admin/dashboard');
                }
            }
        } else if (req.body.id) {
            if (self.ObjectId.test(req.body.id)) {
                next();
            } else {
                if (req.xhr) {
                    return res.jsonp({
                        status: 400,
                        message: error_msg
                    })
                } else {
                    req.flash('danger', error_msg);
                    return res.redirect('/admin/dashboard');
                }
            }

        } else {
            next();
        }
    }
};

exports.isAllow = function (action) {
    return function (req, res, next) {
        if (req.user.email == __config.admin_email) return next();
        __models.Objects.findById(req.user.role_id, function (err, re) {
            if (err) {
                __.logger.error(err);
                return _module.render_error(req, res, '500');
            }
            if (re.values.indexOf(action) >= 0) {
                next();
            } else {
                req.flash('danger', 'Bạn chưa có quyền truy cập vào khu vực này.');
                return res.redirect('/admin/dashboard');
            }
        });
    };
};

exports.createFilter = function (req, res, module_name, opts) {
    res.locals.module_name = module_name;
    let page = req.query.page || 1;
    let order_by = req.query.order_by || opts.order_by || '_id';
    let order_type = req.query.order_type || opts.order_type || 'desc';
    let sort = {};
    sort[req.query.order_by] = req.query.order_type == 'desc' ? -1 : 1;
    if (!req.query.order_by) sort = {created_at: -1};

    let cache_search = '';
    for (let key in req.query) {
        if (req.query.hasOwnProperty(key) && req.query[key].trim() && key !== 'order_by' && key !== 'order_type' && key && key !== 'page') {
            cache_search += `${key}=${req.query[key]}&`;
        }
    }

    res.locals.cache_search = cache_search.slice(0, -1);
    res.locals.requestQuery = req.query;

    return {page, order_by, order_type, sort}
};

exports.verifyCondition = function (queryString, condition) {
    let cond = {};

    if (queryString.key)
        delete queryString.key;
    if (condition.key || condition.pk)
        cond.key = condition.key || condition.pk;

    for (let i in queryString) {
        if (queryString.hasOwnProperty(i) && queryString[i]) {

            for (let j in condition) {
                if (condition.hasOwnProperty(j) && i == j) {
                    if (condition[j].toLocaleLowerCase() == 'date' || condition[j].toLocaleLowerCase() == 'date-range') {
                        let date = queryString[i].split(' - ');
                        if (new Date(date[0]).toString() !== 'Invalid Date' && new Date(date[1]).toString() !== 'Invalid Date') {
                            cond[j] = {
                                $gte: date[0],
                                $lte: date[1]
                            };
                        }
                    } else if (condition[j].toLocaleLowerCase() == 'string') {
                        cond[j] = {
                            $regex: queryString[i],
                            $options: "iu"
                        }
                    } else if (condition[j].toLocaleLowerCase() == 'boolean') {
                        if (queryString[i] !== 'all')
                            cond[j] = queryString[i];
                    } else if (condition[j].toLocaleLowerCase() == 'size') {
                        if (Number(queryString[i]) !== 'NaN') {
                            cond[j] = {
                                $size: Number(queryString[i]) || 0
                            }
                        }
                    }
                }
            }

        }
    }

    return cond;

};

exports.t = function () {
    let currentLang = __config.app.language;
    var args = Array.prototype.slice.call(arguments);
    args[0] = i1n8[currentLang][args[0]] || 'Undefined';
    return util.format.apply(util, args);
};

exports.dateFormatTimeStamp = function (dd, mm, yyyy) {
    return moment(new Date(yyyy, mm - 1, dd)).format('YYYY-MM-DDTHH:mm:ss.SSS');
};

exports.pagination = function (reqQueryPage, pageSize) {
    let offset = 0;
    if (reqQueryPage !== 1) {
        offset = (reqQueryPage - 1) * pageSize;
    }
    return {
        pageSize: pageSize,
        offset: offset
    }
};

exports.isString = function (obj) {
    return ObjProto.toString.call(obj) === '[object String]';
};

exports.isFunction = function (obj) {
    return ObjProto.toString.call(obj) == '[object Function]';
};

exports.isArray = Array.isArray || function (obj) {
        return ObjProto.toString.call(obj) == '[object Array]';
    };

exports.isObject = function (obj) {
    return obj === Object(obj);
};

winston.emitErrs = true;

exports.logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            prettyPrint: true,
            silent: false,
            timestamp: function () {
                var date = new Date();
                return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0, 5);
            }
        }),
        new winston.transports.File({
            level: 'verbose',
            filename: __base + "/logs/webInstall.log",
            handleExceptions: true,
            json: true,
            maxsize: 1024 * 1024 * 10,
            maxFiles: 5,
            timestamp: function () {
                let date = new Date();
                return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0, 5);
            },
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: __base + "/logs/exceptions.log"
        }),
        new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: function () {
                var date = new Date();
                return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0, 5);
            }
        })
    ],
    exitOnError: true
});

/**
 * Md5 crypt
 * @param str
 * @returns {*}
 */
exports.md5Hash = function (str) {
    return require('crypto').createHash('md5').update(str).digest("hex");
};

// 0666
exports.writeFile = function (path, str, mode) {
    fs.writeFileSync(path, str, {mode: mode || 0x1b6});
    self.logger.info('    create: ', path)
};

/**
 * Get files by glob patterns
 */
exports.getGlobbedFiles = function (globPatterns, removeRoot) {
    // For context switching
    let _this = this;

    // URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            let files = glob.sync(globPatterns);
            if (files.length) {
                if (removeRoot) {
                    files = files.map(function (file) {
                        return file.replace(removeRoot, '');
                    });
                }
                output = _.union(output, files);
            }
        }
    }

    return output;
};

/**
 * Get all directories within directory
 * @param srcPath [String] - path directory
 * @param ignore [Array] - Name directory ignore
 * @returns {*} [Array] - List path directory accept ignore condition
 */
exports.getDirectories = function (srcPath, ignore) {
    let dist = [];
    fs.readdirSync(srcPath).filter(function (file) {
        if (fs.statSync(path.join(srcPath, file)).isDirectory()) {
            let push = true;
            ignore.forEach(function (re) {
                if (file === re) push = false;
            });
            if (push) dist.push([srcPath, file].join(path.sep));
        }
    });
    return _.uniq(dist);
};

exports.send_email = function (toEmail, subject, content, attachments, cb) {
    let nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: __config.email.auth
    }, {
        from: __config.email.auth.user,
        headers: __config.email.headers
    });
    let mailOptions = {
        from: __config.email.from,
        to: toEmail,
        subject: subject,
        html: content
    };

    if (attachments) {
        mailOptions.attachments = attachments;
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return cb(error, null);
        } else {
            return cb(null, info)
        }
    });
};

exports.Toolbar = require('./helpers/Toolbars');