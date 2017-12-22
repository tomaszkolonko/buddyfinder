'use strict';

const Wreck = require('wreck');

const heroku_mode = true;

/**
 * Login function
 *
 * @param request
 * @param reply
 */
exports.login = function (request, reply) {

    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/login';
    } else {
        apiUrl = this.apiBaseUrl + '/login';
    }

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),
        json: true
    }, (err, res, payload) => {

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
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com');
        } else {
            reply.redirect(this.webBaseUrl);
        }
    });
};

/**
 * Creates the activity from form data
 *
 * @param request
 * @param reply
 */
exports.createActivity = function (request, reply) {

    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/activities';
    } else {
        apiUrl = this.apiBaseUrl + '/activities';
    }


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
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com');
        } else {
            reply.redirect(this.webBaseUrl);
        }

    });
};

/**
 * Register a new user from form data
 *
 * @param request
 * @param reply
 */
exports.register = function (request, reply) {
    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/register';
    } else {
        apiUrl = this.apiBaseUrl + '/register';
    }

    Wreck.post(apiUrl, {
        payload: JSON.stringify(request.payload),

    }, (err, res, payload) => {
        if(err) {
            throw err;
        }
        // FIXME
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com/login');
        } else {
            reply.redirect(this.webBaseUrl + '/login');
        }
    })

};

/**
 * Log out the user - delete it's session
 *
 * @param request
 * @param reply
 */
exports.logout = function (request, reply) {

    request.cookieAuth.clear();
    // FIXME
    if(heroku_mode) {
        reply.redirect('http://blooming-fortress-94706.herokuapp.com');
    } else {
        reply.redirect(this.webBaseUrl);
    }
};

/**
 * Edit profile of logged in user
 *
 * @param request
 * @param reply
 */
exports.editMyProfile = function (request, reply) {

    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/myProfile/edit';
    } else {
        apiUrl = this.apiBaseUrl + '/myProfile/edit';
    }


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
            throw err;
        }
        reply.redirect("/myProfile");
    });
};