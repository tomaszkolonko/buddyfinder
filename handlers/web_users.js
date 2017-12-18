'use strict';

/**
 * This part of the application is responsible for the webpage shown to the user through her
 * webbrowser. It consumes the API written for this application. That makes it much more
 * modular. The mobile application and the webpage both consume the same API and render the
 * required information in their own way.
 */

const Wreck = require('wreck');

/**
 * Displays the landing page with all activities listed
 *
 * @param request
 * @param reply
 */
exports.home = function (request, reply) {

    // http://localhost:3000/api/activities
    const apiUrl = this.apiBaseUrl + '/activities';

    // Wreck is used to fetch the JSON and parse it. Big advantage is, that it is
    // correctly parsed and can be used as payload.
    Wreck.get(apiUrl, { json: true }, (err, res, payload) => {

        if (err) {
            throw err;
        }

        console.log(payload);

        // it uses the layout for all views, and adds the required handlebars as needed
        // into {{{content}}} placeholder !!!
        reply.view('index', {
            // the view is created out of layout and index!!! Then two variables are defined
            // an array of recipes (payload) and the user (if he/she is existing). These variables
            // are then used to populate the view!!!
            activity: payload,
            user: request.auth.credentials
        });
    });
};

/**
 * Displays the register form
 *
 * @param request
 * @param reply
 */
exports.register = function (request, reply) {
    reply.view('register');
};

/**
 * Displays the login form
 *
 * @param request
 * @param reply
 */
exports.login = function (request, reply) {

    // it uses the layout for all views, and adds the required handlebars as needed
    // into {{{content}}} placeholder !!!
    reply.view('login');
};