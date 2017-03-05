/**
 * @license
 * Copyright (c) 2016 The {life-parser} Project Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://100dayproject.github.io/LICENSE.txt
 * The complete set of authors may be found at http://100dayproject.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://100dayproject.github.io/CONTRIBUTORS.txt
 * Code distributed by 100dayproject as part of the life.
 */

"use strict";

let module_name = 'mod_dashboard',
    _module = new __viewRender('backend', module_name);

_module.view = function (req, res) {


    // var tokenGenerator = new FirebaseTokenGenerator("AIzaSyDkzdcdIMAGF_8p-nzZKzcgSbYTDNbes6s");
    // var token = tokenGenerator.createToken({uid: uid, some: req.user.display_name, data: req.user.created_at});

    // var ref = firebase.database().ref('node-client');
    // console.log(ref);


    // var fb_token = firebase.auth().createCustomToken(uid);

    // console.log(firebase.app);
    //
    // var ref = firebase.database().ref('node-client');
    // var messagesRef = ref.child('messages');
    //
    // messagesRef.push({
    //     name: "Hai",
    //     admin: true,
    //     count: 1,
    //     text: "Hey guys"
    // });


    // usersRef.on('child_added', function(snapshot) {
    //     numbers.push( snapshot.val() );
    //     console.log( 'Added number ' + snapshot.val() );
    // });
    //
    // usersRef.push("Social");

    /**
     * cookie.maxAge is updated automatically by connect.session touch(), but only on server side.
     * The updating of maxAge on client side has to be done manually with res.cookie
     */

    var hour = 3600000;
    req.session.cookie.expires = new Date(Date.now() + hour);
    req.session.cookie.maxAge = hour;
    res.cookie('100dayproject', req.cookies['100dayproject'], {
        maxAge: req.session.cookie.maxAge,
        path: '/',
        httpOnly: true
    });

    Promise.all([
        __models.Posts.count({key: 'article'}).then(function (count) {
            return count;
        }, function (err) {
            if (err) {
                __.logger.error(err);
            }
        }),
        __models.Users.count().then(function (count) {
            return count;
        }, function (err) {
            if (err) {
                __.logger.error(err);
            }
        })
    ]).then(function (statistic) {
        _module.render(req, res, 'dashboard', {
            title: 'Dashboard',
            re: statistic
        })
    });
};

_module.fetch_user_info = function (req, res) {
    __models.Users.find({_id: {$in: req.body.users}}, {
        display_name: 1,
        avatar: 1,
        last_login_date: 1
    }, function (err, result) {
        if (err) {
            return res.jsonp({
                status: 500,
                message: err
            })
        } else {
            return res.jsonp({
                status: 200,
                message: "Danh sách người dùng đang trực tuyến",
                data: result || []
            })
        }
    })
};


module.exports = _module;