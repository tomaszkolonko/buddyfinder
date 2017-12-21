'use strict';

const Wreck = require('wreck');

exports.login = function (request, reply) {
    
    const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/login';
    console.log(request.payload);

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),
        json: true
    }, (err, res, payload) => {

        console.log(payload);

        if (err) {
            throw err;
        }

        if (res.statusCode !== 200) {
            return reply.redirect(apiUrl);
        }

        request.cookieAuth.set({
            token: payload.token
        });
        reply.redirect('http://blooming-fortress-94706.herokuapp.com');
    });
};

exports.createActivity = function (request, reply) {

    const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/activities';

    const token = request.auth.credentials.token;

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, (err, res, payload) => {

        if (err) {
            throw err;
        }

        reply.redirect('http://blooming-fortress-94706.herokuapp.com');
    });
};

exports.register = function (request, reply) {

    const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/register';

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),

    }, (err, res, payload) => {
        if(err) {
            throw err;
        }
        reply.redirect('http://blooming-fortress-94706.herokuapp.com' + '/login');
    })

}

exports.logout = function (request, reply) {

    request.cookieAuth.clear();
    reply.redirect('http://blooming-fortress-94706.herokuapp.com');
};

exports.editMyProfile = function (request, reply) {

    const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/myProfile/edit';

    const token = request.auth.credentials.token;

    request.payload["token"] = token;

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),
        json: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, (err, res, payload) => {
        if (err) {
            console.log("THROWING ERROR");
            throw err;
        }
        console.log("AFTER ACTIONS EDIT PROFILE");
        reply.redirect("/myProfile");
    });
};