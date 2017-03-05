/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

/**
 * POST: /api/media/upload?input_name=uploads
 * POST: /api/upage_cover/upload?input_name=uploads
 * POST: /api/upage_branch/upload?input_name=uploads
 * @param app
 */

let formidable = require('formidable');

/**
 * Regex fix file name special
 * @param file_name
 * @returns {string}
 * @constructor
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

module.exports = function (app) {
    app.route('/api/:resource/upload').post(function (req, res) {

        let input_name = req.query.input_name;
        let destination = req.params.resource;

        let form = new formidable.IncomingForm();
        form.uploadDir = require('path').resolve(__base, 'public', 'uploads', 'images', destination);
        form.parse(req, function (err, fields, files) {
            if (err) {
                return res.jsonp({
                    status: 500
                })
            }

            // Return base file name
            var file_name = FixName(files[input_name].name);

            // Expose new name file
            var new_file_name = `${file_name.split('.')[0]}_${Date.now()}.${file_name.split('.')[1]}`;

            // Upload into the server
            require('fs').rename(files[input_name].path, require('path').join(form.uploadDir, new_file_name));
            var file_path = require('path').join(form.uploadDir, new_file_name);

            // Save path as database
            if (destination == 'article') {
                let newMedia = new __models.Media({
                    path: file_path,
                    user_id: {
                        _id: req.user._id,
                        display_name: req.user.display_name
                    }
                });

                newMedia.save(function (err, re) {
                    if (err) {
                        return res.jsonp({
                            status: 500,
                            message: err
                        })
                    }
                    return res.jsonp({
                        status: 200,
                        message: re,
                        path: file_path,
                        file_name: new_file_name,
                        created_at: re.created_at
                    })
                })
            }

            return res.jsonp({
                status: 200,
                message: "Upload successfully!",
                path: '/uploads/images/' + destination + '/' + new_file_name
            })
        })
    });
};