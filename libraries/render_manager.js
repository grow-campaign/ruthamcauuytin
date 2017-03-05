/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let _ = require('lodash');
let chalk = require('chalk');
let path = require('path');
let nunjucks = require('nunjucks');
let viewEngine = require('../config/express/nunjucks');

class Render {
    constructor(layer, moduleName) {
        this.ext = '.crab';
        if (layer) this.layer = layer.toString().toLowerCase();
        if (moduleName) this.moduleName = moduleName.toString().toLowerCase();
    }

    /**
     * Item within Array map new value
     * @param array [Array] - Base array
     * @param val [String] - Value extend into item in base array
     * @returns {*} String
     */
    static mapArray(array, val) {
        return array.map(function (i) {
            return val + i;
        })
    }

    /**
     * Using FileSystemLoader for load path view engine
     * @param views [Array] - Array path loader
     * @returns {*}
     */
    static systemLoader(views) {
        this.env = new nunjucks.Environment(new nunjucks.FileSystemLoader(views));
        return this.env;
    }

    /**
     * Using WebLoader for load path view engine
     * @param views [Array] - Array path loader
     * @returns {*}
     */
    static webLoader(views) {
        this.env = new nunjucks.Environment(new nunjucks.WebLoader(views));
        return this.env;
    }

    /**
     * Function support for render error page
     * @param req - Express `request`
     * @param res - Express `response`
     * @param view [Array] - Array path loader
     */
    render_error(req, res, view) {
        if (view.indexOf(this.ext) == -1) {
            view += this.ext;
        }

        if (this.layer == 'backend') {
            this.env = Render.systemLoader([__base + '/administrator/templates/']);
        } else {
            this.env = Render.systemLoader([__base + '/templates/']);
        }

        //Load only core filter and global when render error to view
        viewEngine.require(this.env, __base + '/core/nunjucks_global/*.js');
        viewEngine.require(this.env, __base + '/core/nunjucks_filter/*.js');

        var obj = {};
        this.env.render(view, _.assign(obj, res.locals, {}), function (err, re) {
            if (err) {
                res.send(err.stack)
            } else {
                res.send(re);
            }
        })
    }

    /**
     * Main render function for modules
     * @param req - Express `request`
     * @param res - Express `response`
     * @param view - Name view render
     * @param options - [Object] Data showing view
     * @param fn
     */
    render(req, res, view, options, fn) {
        // global.__objects = {
        //     req: req
        // };

        /**
         * Have using req.user & req.session.flash
         * when you need extends data to view render,
         * but our using res.locals
         * config/express/index.js, line: 98
         */

        try {
            if (view.indexOf(this.ext) == -1) {
                view += this.ext;
            }
            let layer = this.layer;

            if (this.layer == 'backend') {
                // Search view path many location folders
                this.multiplePath = Render.mapArray([
                    '/administrator/templates/',
                    '/administrator/modules/'
                ], __base);
                this.env = Render.systemLoader(this.multiplePath);
            } else {
                this.multiplePath = Render.mapArray([
                    '/templates/',
                    '/modules/'
                ], __base);
                this.env = Render.systemLoader(this.multiplePath);
            }

            //Load only core filter and global when render error to view
            viewEngine.require(this.env, __base + '/core/nunjucks_global/*.js');
            viewEngine.require(this.env, __base + '/core/nunjucks_filter/*.js');

            let module = this.moduleName || this.layer;
            if (module) {
                if (module.indexOf('/') == 0) {
                    view = path.join(module.substring(1), 'views', view);
                } else if (module.indexOf('./') == 0) {
                    view = path.join(module.slice(2), 'views', view);
                } else {
                    view = path.join(module, 'views', view);
                }
            }

            var obj = {};
            if (fn) {
                this.env.render(view, _.assign(obj, res.locals, options), fn);
            } else {
                this.env.render(view, _.assign(obj, res.locals, options), function (err, html) {
                    if (err) {
                        __.logger.error({
                            "File": 'Error: render_manager.js ',
                            "Messages": err.stack
                        });

                        req.flash('danger', `Error code: 401 - Phiên làm việc của bạn đã được ghi nhận để kiểm tra.<br>
                         Hệ thống đã ghi nhận và phản hồi tới bạn khi đã khắc phục.`);
                        res.redirect(`/${__config.admin_prefix}/dashboard`);
                        //res.send(err.stack);
                    } else {

                        res.send(html);

                        // if (layer == 'backend') {
                        //     res.send(html);
                        // } else {
                        //     var re = require('html-minifier').minify(html, {
                        //         // removeAttributeQuotes: true,
                        //         collapseWhitespace: true,
                        //         minifyCSS: true,
                        //         minifyJS: true,
                        //         minifyURLs: true,
                        //         removeComments: true,
                        //         removeEmptyAttributes: true,
                        //         removeEmptyElements: true,
                        //         // removeOptionalTags: true,
                        //         removeTagWhitespace: true
                        //     });
                        //     res.send(re);
                        // }
                    }
                })
            }
        } catch (e) {
            // __.logger.error(e);
            // req.flash('warning', 'Có lỗi xảy ra');
            // res.redirect(`/${__config.admin_prefix}/dashboard`);
        }
    }
}

module.exports = Render;