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

class Toolbars {
    constructor() {
        this.toolbar = [];
        this.env = [];
        this.useDeleteModal = false;
    }

    addButton(button) {
        this.toolbar.push(button);
    }

    addGeneralButton(permission, title, link, optional) {
        permission = permission || false;
        title = title || '';
        link = link || 'javascript: void(0);';
        let icon = _.isObject(optional) && optional.icon ? optional.icon : '';
        let wrapperClass = _.isObject(optional) && optional.wrapperClass ? optional.wrapperClass : '';
        let buttonClass = _.isObject(optional) && optional.buttonClass ? optional.buttonClass : 'btn btn-default';
        let onclickFunction = _.isObject(optional) && optional.onclickFunction ? ` onclick="${optional.onclickFunction}"` : ``;
        let target = _.isObject(optional) && optional.target ? ` target="${optional.target}"` : ``;

        if (permission) {
            this.addButton(`<a href="${link}"${target} class=${wrapperClass}>
                        <button type="button" class="${buttonClass}"${onclickFunction}>
                            ${icon} ${title}
                        </button>
                    </a>`);
        }
    }

    backButton(opts) {
        let text = opts.text || 'Quay lại';
        if (opts.link) {
            let link = opts.link || 'javascript: window.history.back();';
            this.addGeneralButton(true, text, link, {icon: '<i class="fa fa-angle-left"></i>'})
        } else {
            throw new Error('ERROR toolbars throw exception: @Params `link` is not define!');
        }
    }

    createButton(opts) {
        if (opts.access) {
            let text = opts.text || 'Tạo mới';
            this.addGeneralButton(true, text, opts.link, {
                icon: '<i class="fa fa-plus"></i>',
                buttonClass: 'btn btn-primary'
            })
        }
    }

    refreshButton(opts) {
        let text = opts.text || 'Làm mới';
        if (opts.link) {
            this.addGeneralButton(true, text, opts.link, {
                icon: '<i class="fa fa-refresh"></i>',
                buttonClass: 'btn btn-info'
            })
        }
    }

    exportButton(opts) {
        let text = opts.text || 'Làm mới';
        if (opts.link) {
            this.addGeneralButton(true, text, opts.link, {
                icon: '<i class="fa fa-refresh"></i>',
                buttonClass: 'btn btn-info'
            })
        }
    }

    searchButton(opts) {
        let text = opts.text || 'Tìm kiếm';
        let button = `<a href="javascript: void(0);">
                        <button type="submit" form="search-form" class="btn btn-warning"
                           onclick='return document.forms["search-form"].submit();'>
                            <i class="fa fa-search"></i> ${text}</button>
                    </a>`;
        this.addButton(button);
    }

    deleteButton(opts) {
        if (opts.access) {
            let text = opts.text || 'Xóa';
            this.useDeleteModal = true;
            this.addButton(`<a class="pull-right" data-toggle="modal" onclick="openDeleteConfirmModal()">
                        <button class="btn btn-danger"><i class="fa fa-remove"></i> ${text}</button></a>`)

        }
    }

    saveButton(opts) {
        if (opts.access) {
            let text = opts.text || 'Lưu lại';
            this.addButton(`<a href="javascript: void(0);">
                        <button type="submit" id="saveForm" class="btn btn-success">
                            <i class="fa fa-check"></i> ${text}</button>
                    </a>`);
        }
    }

    custom(optional) {
        if (_.isObject(optional)) {
            let keys = Object.keys(optional);

            for (let i in keys) {
                // Condition validate object params
                if (keys.hasOwnProperty(i) && _.isObject(optional[keys[i]])) {
                    let key = keys[i],
                        opt = optional[keys[i]];
                    this[key](opt)
                } else {
                    throw new Error('ERROR toolbars throw exception: Toolbars optional accept object params.');
                }
            }
        }
    }

    render() {
        let toolbar = this.toolbar.join('');
        let content = `<div class="toolbar">${toolbar}</div>`;
        if (this.useDeleteModal)
            content += `<div class="modal fade" id="confirm-delete-modal" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                        <h4 class="modal-title">Xác nhận xóa</h4>
                                    </div>
                                    <div class="modal-body">
                                        Bạn chắc chắn muốn xóa thông tin này khỏi danh sách ?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn default" data-dismiss="modal">Hủy bỏ</button>
                                        <button type="button" class="btn btn-danger" onclick="deleteRecords()">Xác nhận</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <script>
                            function openDeleteConfirmModal() {
                                var ids = [];
                                $("input:checkbox[name='ids[]']:checked").each(function () {
                                    ids.push($(this).val());
                                });
                                if (ids.length > 0) {
                                    $('#confirm-delete-modal').modal('show');
                                }
                            }
                        </script>`;

        return content;
    }
}

module.exports = Toolbars;