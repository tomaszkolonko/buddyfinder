'use strict';

const Wreck = require('wreck');

exports.login = function (request, reply) {
    
    const apiUrl = this.apiBaseUrl + '/login';
    console.log(request.payload);

    Wreck.post('http://blooming-fortress-94706.herokuapp.com/api/login', {
        payload: JSON.stringify(request.payload),
        json: true
    }, (err, res, payload) => {

        console.log(payload);

        if (err) {
            throw err;
        }

        if (res.statusCode !== 200) {
            return reply.redirect('http://blooming-fortress-94706.herokuapp.com/api/login');
        }

        request.cookieAuth.set({
            token: payload.token
        });
        reply.redirect(this.webBaseUrl);
    });
};

exports.createActivity = function (request, reply) {

    const apiUrl = this.apiBaseUrl + '/activities';

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

        reply.redirect(this.webBaseUrl);
    });
};

exports.register = function (request, reply) {

    const apiUrl = this.apiBaseUrl + '/register';

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),

    }, (err, res, payload) => {
        if(err) {
            throw err;
        }
        reply.redirect(this.webBaseUrl + '/login');
    })

}

exports.logout = function (request, reply) {

    request.cookieAuth.clear();
    reply.redirect(this.webBaseUrl);
};

exports.editMyProfile = function (request, reply) {

    const apiUrl = this.apiBaseUrl + '/myProfile/edit';

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