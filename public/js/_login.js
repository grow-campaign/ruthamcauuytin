/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

var $email = $('#email'),
    $password = $('#password'),
    $email_msg = $('.email-msg'),
    $password_msg = $('.password-msg');

function remove_error(pwd) {
    if (pwd) {
        if ($password.hasClass('wrong-entry')) {
            $password.removeClass('wrong-entry');
        }
    } else {
        if ($email.hasClass('wrong-entry')) {
            $email.removeClass('wrong-entry');
        }
    }


}
function remove_success(pwd) {
    if (pwd) {
        if ($password.hasClass('success-entry')) {
            $password.removeClass('success-entry');
        }
    } else {
        if ($email.hasClass('success-entry')) {
            $email.removeClass('success-entry');
        }
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validEmail() {
    if ($email.val().trim().toLocaleLowerCase() == '' || !isEmail($email.val().trim().toLocaleLowerCase())) {
        remove_success(false);
        $email.addClass('wrong-entry');
    }

    if ($email.val().trim().toLocaleLowerCase() == '') {
        $email_msg.text("Please enter an email address");
    } else if (!isEmail($email.val().trim().toLocaleLowerCase())) {
        $email_msg.text("Please enter a valid email address");
    } else {
        remove_error(false);
        $email.addClass('success-entry');
        $email_msg.text('');
    }
}

function validPassword() {
    if ($password.val().trim() == '') {
        remove_error(true);
        $password.addClass('wrong-entry');
        $password_msg.text("Please enter a password");
    } else {
        remove_error(true);
        $password.addClass('success-entry');
        $password_msg.text('');
    }
}

$(document).ready(function () {

    $('#frmLogin').submit(function () {
        return isValidate() ? true : false;
    });

    function isValidate() {
        if ($email.val().trim().toLocaleLowerCase() == '' || !isEmail($email.val().trim().toLocaleLowerCase())) {
            remove_success(false);
            $email.addClass('wrong-entry');
        }

        if ($email.val().trim().toLocaleLowerCase() == '') {
            $email_msg.text("Please enter an email address");
        } else if (!isEmail($email.val().trim().toLocaleLowerCase())) {
            $email_msg.text("Please enter a valid email address");
        } else {
            remove_error(false);
            $email.addClass('success-entry');
            $email_msg.text('');
        }

        if ($password.val().trim() == '') {
            remove_success(true);
            $password.addClass('wrong-entry');
            $password_msg.text("Please enter a password");
        } else {
            remove_error(true);
            $password.addClass('success-entry');
            $password_msg.text('');
        }

        return $email.hasClass('wrong-entry') || $password.hasClass('wrong-entry') ? false : true;
    }
});

$("input#email").change(function () {
    validEmail();
});
$('input#password').change(function () {
    validPassword();
});

$('#login-google').click(function () {
    $('.crab-msg').css('display', 'block');
    $(this).remove()
});