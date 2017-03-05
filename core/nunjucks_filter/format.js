"use strict";

module.exports = function (env) {

    env.addFilter('content_type', function (source) {
        if (source) {
            var size = source.split('.');
            if ('jpg,bmp,jpeg,gif,png'.indexOf(size[size.length - 1]) !== -1) {
                return 'image';
            } else if (source.indexOf('youtube.com') !== -1) {
                return 'youtube';
            }
        }
    });

    env.addFilter('number_format', function (num) {
        return require('numeral')(num).format('0,0');
    });

    env.addFilter('dateFormat', function (input) {
        var t = new Date(input);
        var date = [String('00' + t.getDate()).slice(-2), String('00' + (t.getMonth() + 1)).slice(-2), t.getFullYear()];
        return date.join('/');
    });

    env.addFilter('cardFormat', function (cardNumber) {
        return `${cardNumber.substr(0, 4)}${' - '}${cardNumber.substr(4)}`;
    });

    env.addFilter('timeFormat', function (input) {
        var t = new Date(input);
        var date = [String('00' + t.getDate()).slice(-2), String('00' + (t.getMonth() + 1)).slice(-2), t.getFullYear()];
        var time = [String('00' + t.getHours()).slice(-2), String('00' + t.getMinutes()).slice(-2), String('00' + t.getSeconds()).slice(-2)];
        return `${date.join('/')} - ${time.join(':')}`;
    });

    env.addFilter('timeFormatString', function (input) {
        if (input && input.indexOf('T') >= 0 && input.indexOf('-') >= 0 && input.indexOf('.') >= 0) {
            return `${input.split('T')[0].split('-').reverse().join('/')} - ${input.split('T')[1].split('.')[0]}`
        } else {
            return '';
        }
    });

    env.addFilter('moment', function (input) {
        let moment = require('moment');
        moment.locale('vn');
        moment.locale('en', {
            relativeTime: {
                future: "trong %s",
                past: "%s trước",
                s: "giây",
                m: "1 phút",
                mm: "%d phút",
                h: "1 giờ",
                hh: "%d giờ",
                d: "1 ngày",
                dd: "%d ngày",
                M: "1 tháng",
                MM: "%d tháng",
                y: "1 năm",
                yy: "%d năm"
            }
        });
        return moment(input).fromNow();
    })
};