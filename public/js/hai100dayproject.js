/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";
var config = {
    media: {
        list_dir: ''
    }
};

function haiRE() {
}

/**
 * @return {string}
 */
haiRE.FixPath = function (path) {
    var res = '';
    if (path) {
        res = path.replace(/\\/g, '');
        res = res.replace(/\/\//g, '/');
        res = res.replace(':/', '://');
    }
    return res;
};

/**
 * @return {number}
 */
haiRE.GetFileSize = function (path) {
    var res = 0;
    $.ajax({
        url: path,
        type: 'HEAD',
        async: false,
        success: function (d, s, xhr) {
            res = xhr.getResponseHeader('Content-Length');
        }
    });
    return res;
};

/**
 * @return {string}
 */
haiRE.FormatFileSize = function (f) {
    var prefix = 'B';
    if (!f) {
        f = 0;
    }
    if (f > 1024) {
        f = f / 1024;
        prefix = 'KB';
    }
    if (f > 1024) {
        f = f / 1024;
        prefix = 'MB';
    }

    f = Number(f);
    return f.toFixed(2) + ' ' + prefix;
};

/**
 *
 * @return {string}
 */
haiRE.GetFileName = function (path) {
    var res = path;
    if (path.indexOf('/') > -1) {
        res = path.substring(path.lastIndexOf('/') + 1);
    }
    return res;
};

/**
 * @return {string}
 */
haiRE.GetFileIcon = function (path) {
    var res = '/images/filetypes/unknown.png';
    if (!haiRE.IsImage(path)) {
        res = '/images/filetypes/' + 'file_extension_' + haiRE.GetFileExt(path) + '.png';
    }

    return res;
};

/**
 * @return {string}
 */
haiRE.GetFileExt = function (path) {
    var res = '';
    path = haiRE.GetFileName(path);
    if (path.indexOf('.') > -1) {
        res = path.substring(path.lastIndexOf('.') + 1);
    }
    return res;
};

/**
 * @return {string}
 */
haiRE.GetFileType = function (path) {
    var res = haiRE.GetFileExt(path).toLocaleLowerCase().trim();
    if (res == 'png' || res == 'jpg' || res == 'jpeg' || res == 'bmp' || res == 'gif') {
        return 'image';
    }
};

/**
 * @return {boolean}
 */
haiRE.IsImage = function (path) {
    var res = false;
    if (haiRE.GetFileType(path) == 'image') {
        res = true;
    }
    return res;
};

/**
 * @return {boolean}
 */
haiRE.FileExists = function (path) {
    var res = false;
    $.ajax({
        url: path,
        type: 'HEAD',
        async: false,
        dataType: 'text',
        success: function () {
            res = true
        }
    });
    return res;
};

function dateFormat(input) {
    var t = new Date(input);
    var date = [String('00' + t.getDate()).slice(-2), String('00' + (t.getMonth() + 1)).slice(-2), t.getFullYear()];
    return date.join('/');
}

function GetInformation(e) {
    $(window.parent.document).find('#previewMedia').attr('src', $(e).attr('src'));
    $('#name_media').text(haiRE.GetFileName($(e).attr('src')));
    $('#size_media').text(haiRE.FormatFileSize(haiRE.GetFileSize($(e).attr('src'))));
    $('#createdAt_media').text(dateFormat($(e).attr('created_at')));
}

var page_number = 1;
$('.media-content').bind('scroll', function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        if (page_number) {
            $.ajax({
                type: 'POST',
                url: '/post/list/media',
                data: {
                    page: page_number
                },
                success: function (result) {
                    page_number += 1;
                    var data = result.data;
                    if (result.status == 200) {
                        if (data.length == 0) {
                            page_number = null
                        }
                        for (var i = 0; i < data.length; i++) {
                            $('.media-content').append(`<img created_at="${data[i].created_at}" onclick="GetInformation(this)" src="${data[i].path}" class="img-thumbnail" alt="Cinque Terre" width="120" style="margin: 5px; cursor: pointer;">`)
                        }
                    }
                }
            });
        }
    }
});

function openModalMedia() {
    page_number = 1;
    $.ajax({
        type: 'POST',
        url: '/post/list/media',
        data: {
            page: 0
        },
        success: function (result) {
            var data = result.data;
            if (result.status == 200) {
                for (var i = 0; i < data.length; i++) {
                    $('.media-content').append(`<img created_at="${data[i].created_at}" onclick="GetInformation(this)" src="${data[i].path}" class="img-thumbnail" width="120" style="margin: 5px; cursor: pointer;">`)
                }
            }
        }
    });

    var $media = $('#mediaModal');
    $media.modal('show');
}

$('#mediaModal').on('hidden.bs.modal', function () {
    $('.media-content').empty();
});

function removeElementById(id) {
    $(`#${id}`).remove();
}

var $btn_upload = $('#upload-input');
$btn_upload.on('change', function () {
    var files = $(this).get(0).files;

    if (files.length > 0) {

        var formData = new FormData();

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            formData.append('uploads[]', file, file.name);
        }

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                $('.media-content img:first-child').before(`<img created_at="${data.created_at}" onclick="GetInformation(this)" src="/media/${data.file_name}" class="img-thumbnail" width="120" style="margin: 5px; cursor: pointer;">`);
            },
            xhr: function () {
                var xhr = new XMLHttpRequest();
                $('.media-content img:first-child').before(`<img src="/images/squarespinner_2x.gif" class="img-thumbnail" alt="hai100dayproject" width="100" style="margin: 5px; cursor: pointer;">`);
                xhr.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        if (percentComplete === 100) {
                            $('.media-content img').first().remove();
                        }
                    }
                }, false);

                return xhr;
            }
        })
    }
});

function select_media() {
    var img_val = $('#previewMedia').attr('src');
    var $media = $('#mediaModal');
    $('#previewImage').attr('src', img_val);
    $('#input_previewImage').attr('value', img_val);
    $media.modal('hide');
}

function remove_media() {
    var img_path = $('#previewMedia').attr('src');
    if (img_path) {
        var file_name = img_path.split('/')[2];
        $.ajax({
            url: '/api/media/' + file_name,
            type: 'DELETE',
            dataType: 'jsonp',
            success: function (result) {
                if (result.status === 200) {
                    let img = `img[src="${img_path}"]`;
                    $('.media-content').find(img).remove();
                    $.notify("Xóa hình ảnh thành công!", 'success');
                } else {
                    $.notify("Có lỗi xảy ra khi thực hiện xóa hình ảnh", 'error');
                }
            }
        })
    }
}


$.fn.extend({
    crab_media: function (options) {
        'use strict';
        /*global YT,$f*/

        var self = this;

        // Globals
        var languages = {
            en: {
                close_text: 'Close',
                title_text: 'Upload/Select media',
                select_text: 'Select image',
                upload_text: 'Upload file',
                file_name: 'File Name',
                file_size: 'File Size',
                created_at: 'Created At'
            },
            vi: {
                close_text: 'Đóng',
                title_text: 'Tải lên/Chọn media',
                select_text: 'Chọn hình ảnh',
                upload_text: 'Tải lên tệp tin',
                file_name: 'Tên file',
                file_size: 'Dung lượng',
                created_at: 'Ngày tạo'
            }
        };

        var lang = {};
        if (options.lang && options.lang.toLowerCase().trim() === 'vi') {
            lang.close = languages.vi.close_text;
            lang.title = languages.vi.title_text;
            lang.select = languages.vi.select_text;
            lang.upload = languages.vi.upload_text;
            lang.file_name = languages.vi.file_name;
            lang.file_size = languages.vi.file_size;
            lang.created_at = languages.vi.created_at;
        } else {
            lang.close = languages.en.close_text;
            lang.title = languages.en.title_text;
            lang.select = languages.en.select_text;
            lang.upload = languages.en.upload_text;
            lang.file_name = languages.en.file_name;
            lang.file_size = languages.en.file_size;
            lang.created_at = languages.en.created_at;
        }

        // Default config
        var defaults = {
            target: '.crab',
            multi: false,
            remove: true,
            info: true,
            close_text: lang.close,
            title_text: lang.title,
            select_text: lang.select,
            upload_text: lang.upload,
            file_name: lang.file_name,
            file_size: lang.file_size,
            created_at: lang.created_at,
            default_image: '/images/no_image_available.jpeg',
            ajax: {
                type: 'POST',
                url: '/post/list/media',
                data: {
                    page: 0
                }
            }
        };

        var GetInformation = function (e) {
            $(window.parent.document).find('#previewMedia').attr('src', $(e).attr('src'));
            $('#name_media').text(haiRE.GetFileName($(e).attr('src')));
            $('#size_media').text(haiRE.FormatFileSize(haiRE.GetFileSize($(e).attr('src'))));
            $('#createdAt_media').text(dateFormat($(e).attr('created_at')));
        };

        var page_number;
        $(this).on('click', function () {
            if (options.ajax) {
                page_number = 1;
                options.ajax.success = function (result) {
                    var data = result.data;
                    if (result.status == 200) {
                        for (var i = 0; i < data.length; i++) {
                            $('.media-content').append(`<img created_at="${data[i].created_at}" onclick="self.GetInformation(this)" 
                                src="${data[i].path}" class="img-thumbnail" width="120" style="margin: 5px; cursor: pointer;">`)
                        }
                    }
                };
                $.ajax(options.ajax);
            }
            var $media = $('#mediaModal');
            $media.modal('show');
        });

        var html = [];

        html.push(
            '<div id="mediaModal" class="modal fade" role="dialog">' +
            '<div class="modal-dialog modal-lg"><div class="modal-content">'
        );

        var header = `<div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">${options.title_text || defaults.title_text}</h4>
                      </div>`;
        var body = `<div class="modal-body">
                <div class="col-md-8 media-content"></div>
                <div class="col-md-4 media-info">
                    <dl class="dl-horizontals">
                        <dt>
                            <img id="previewMedia" class="img-thumbnail" src="${options.default_image || defaults.default_image}">
                        </dt>
                        <dd>${options.file_name || defaults.file_name}:<div style="display: inline;" id="name_media"></div></dd>
                        <dd>${options.file_size || defaults.file_size}:<div style="display: inline;" id="size_media"></div></dd>
                        <br>
                        <dt style="display: inline">${options.created_at || defaults.created_at}:</dt>
                        <dd style="display: inline" id="createdAt_media"></dd>
                        <br><br>
                        <dd><div onclick="select_media()" class="btn btn-primary">${options.select_text || defaults.select_text}</div></dd>
                    </dl>
                </div>
            </div>`;
        var footer = `<div class="modal-footer">
                <div class="row">
                    <div class="col-md-12">
                        <div class="btn btn-primary btn-file">
                            <i class="fa fa-upload" aria-hidden="true"></i> ${options.upload_text || defaults.upload_text}
                            <input type="file" name="uploads[]" multiple="multiple" id="upload-input">
                        </div>
                        <button type="button" class="btn btn-default" data-dismiss="modal">${options.close_text || defaults.close_text}</button>
                    </div>
                </div>
            </div>`;

        $(body).find('dt:first-child').css('padding-bottom', '12px');
        $(body).find('dt:first-child').find('img').css('max-width', '30%');

        $(footer).find('.btn-file').css({
            'position': 'fixed',
            'left': '30px'
        });

        html.push(header);
        html.push(body);
        html.push(footer);


        // End modal
        html.push('</div></div></div>');

        return html.join('');
    }
});

$('#target').crab_media({
    target: '.crab',
    dist: '.crab_dist',
    multi: false,
    remove: true,
    info: true,
    language: 'vi',
    default_image: '/images/no_image_available.jpeg',
    ajax: {
        type: 'POST',
        url: '/post/list/media',
        data: {
            page: 0
        }
    }
});