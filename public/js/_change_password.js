/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

var $password = $('input[name=password]'),
    $password_msg = $('.password-msg'),
    $confirm = $('input[name=confirm_password]'),
    $confirm_msg = $('.confirm-msg');

function remove_error(pwd){
    if (pwd) {
        if ($password.hasClass('wrong-entry')) {
            $password.removeClass('wrong-entry');
        }
    } else {
        if ($confirm.hasClass('wrong-entry')) {
            $confirm.removeClass('wrong-entry');
        }
    }


}
function remove_success(pwd){
    if (pwd){
        if ($password.hasClass('success-entry')) {
            $password.removeClass('success-entry');
        }
    } else {
        if ($confirm.hasClass('success-entry')) {
            $confirm.removeClass('success-entry');
        }
    }
}

function validPassword(){
    if ($password.val().trim().toLocaleLowerCase() == '') {
        remove_success(true);
        $password.addClass('wrong-entry');
        $password_msg.text("Please enter a new password");
    } else {
        remove_error(true);
        $password.addClass('success-entry');
        $password_msg.text('');
    }
}

function validConfirm(){
    if ($confirm.val().trim().toLocaleLowerCase() == '') {
        remove_success(false);
        $confirm.addClass('wrong-entry');
        $confirm_msg.text("Please enter a new password confirm");
    } else if ($password.val() !== $confirm.val()) {
        remove_success(false);
        $confirm.addClass('wrong-entry');
        $confirm_msg.text("Passwords do not match, please retype");
    } else {
        remove_error(false);
        $confirm.addClass('success-entry');
        $confirm_msg.text('');
    }
}


$(document).ready(function () {
    $('#frmChange_password').submit(function () {
        return isValidate() ? true : false;
    });

    function isValidate() {
        if ($password.val().trim().toLocaleLowerCase() == '') {
            remove_success(true);
            $password.addClass('wrong-entry');
            $password_msg.text("Please enter a new password");
        } else {
            remove_error(true);
            $password.addClass('success-entry');
            $password_msg.text('');
        }

        if ($confirm.val().trim().toLocaleLowerCase() == '') {
            remove_success(false);
            $confirm.addClass('wrong-entry');
            $confirm_msg.text("Please enter a new password confirm");
        } else if ($password.val() !== $confirm.val()) {
            remove_success(false);
            $confirm.addClass('wrong-entry');
            $confirm_msg.text("Passwords do not match, please retype");
        } else {
            remove_error(false);
            $confirm.addClass('success-entry');
            $confirm_msg.text('');
        }

        return $password.hasClass('wrong-entry') || $confirm.hasClass('wrong-entry') ? false : true;
    }
});