/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

$.ajaxSetup({
    headers: {'X-CSRF-Token': $('input[name="_csrf"]').val()}
});

var $email = $('#email'), $email_msg = $('.email-msg');

function remove_color(success){
    if (success) {
        if ($email.hasClass('success-entry')) {
            $email.removeClass('success-entry');
        }
    } else {
        if ($email.hasClass('wrong-entry')) {
            $email.removeClass('wrong-entry');
        }
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validEmail() {
    if ($email.val().trim().toLocaleLowerCase() == '' || !isEmail($email.val().trim().toLocaleLowerCase())) {
        remove_color(true);
        $email.addClass('wrong-entry');
    }

    if ($email.val().trim().toLocaleLowerCase() == '') {
        $email_msg.text("Please enter an email address");
    } else if (!isEmail($email.val().trim().toLocaleLowerCase())) {
        $email_msg.text("Please enter a valid email address");
    } else {
        remove_color(false);
        $email.addClass('success-entry');
        $email_msg.text('');
    }
}

$(document).ready(function () {
    $('#frmForgot').submit(function () {
        if (isValidate()) {
            $('.crab-msg').css('display', 'block');
            $('.animated.fadeInUp').css('display', 'none');
            $.ajax({
                url: '/forgot_password.crab',
                type: 'POST',
                data: {
                    email: $("input[name=email]").val()
                },
                success: function (result) {
                    $('.animated .alert').text(result.message);

                    var $msg_parent = $('section.animated .animated');

                    if (result.status === 200) {
                        if ($msg_parent.hasClass('messages-error')) {
                            $('section.animated .animated').removeClass('messages-error');
                        }
                        $msg_parent.addClass('messages-success');
                        $('.animated.fadeInUp').css('display', 'block');

                    } else {
                        if ($msg_parent.hasClass('messages-success')) {
                            $('section.animated .animated').removeClass('messages-success');
                        }
                        $msg_parent.addClass('messages-error');
                        $('.animated.fadeInUp').css('display', 'block');

                    }
                    $('.crab-msg').css('display', 'none');
                }
            })
        }
        return false;
    });

    function isValidate() {
        if ($email.val().trim().toLocaleLowerCase() == '' || !isEmail($email.val().trim().toLocaleLowerCase())) {
            remove_color(true);
            $email.addClass('wrong-entry');
        }

        if ($email.val().trim().toLocaleLowerCase() == '') {
            $email_msg.text("Please enter an email address");
        } else if (!isEmail($email.val().trim().toLocaleLowerCase())) {
            $email_msg.text("Please enter a valid email address");
        } else {
            remove_color(false);
            $email.addClass('success-entry');
            $email_msg.text('');
        }

        return $email.hasClass('wrong-entry') ? false : true;
    }
});

$('input#email').change(function(){
    validEmail();
});