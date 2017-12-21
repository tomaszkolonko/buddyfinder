'use strict';

const Wreck = require('wreck');

exports.login = function (request, reply) {

    // FIXME
    //const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/login';
    const apiUrl = this.apiBaseUrl + '/login';

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
        // FIXME
        // reply.redirect('http://blooming-fortress-94706.herokuapp.com');
        reply.redirect(this.webBaseUrl);
    });
};

exports.createActivity = function (request, reply) {

    // FIXME
    // const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/activities';
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
        // FIXME
        // reply.redirect('http://blooming-fortress-94706.herokuapp.com');
        reply.redirect(this.webBaseUrl);
    });
};

exports.register = function (request, reply) {
    // FIXME
    // const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/register';
    const apiUrl = this.apiBaseUrl + '/register';

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),

    }, (err, res, payload) => {
        if(err) {
            throw err;
        }
        // FIXME
        // reply.redirect('http://blooming-fortress-94706.herokuapp.com' + '/login');
        reply.redirect(this.webBaseUrl + '/login');
    })

}

exports.logout = function (request, reply) {

    request.cookieAuth.clear();
    // FIXME
    // reply.redirect('http://blooming-fortress-94706.herokuapp.com');
    reply.redirect(this.webBaseUrl);
};

exports.editMyProfile = function (request, reply) {

    // FIXME
    // const apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/myProfile/edit';
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
        // FIXME
        reply.redirect("/myProfile");
    });
};