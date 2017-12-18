'use strict';

const Wreck = require('wreck');

exports.getOne = function (request, reply) {

    const activityID = request.params._id;

    // http://localhost:3000/api/activities
    const apiUrl = this.apiBaseUrl + '/activities/' + activityID;

    // Wreck is used to fetch the JSON and parse it. Big advantage is, that it is
    // correctly parsed and can be used as payload.
    Wreck.get(apiUrl, { json: true }, (err, res, payload) => {

        if (err) {
            throw err;
        }

        console.log(payload);

        // it uses the layout for all views, and adds the required handlebars as needed
        // into {{{content}}} placeholder !!!
        reply.view('activity', {
            // the view is created out of layout and index!!! Then two variables are defined
            // an array of recipes (payload) and the user (if he/she is existing). These variables
            // are then used to populate the view!!!
            activity: payload,
            user: request.auth.credentials
        });
    });



};

exports.createActivity = function (request, reply) {

    // it uses the layout for all views, and adds the required handlebars as needed
    // into {{{content}}} placeholder !!!
    reply.view('create', {
        user: request.auth.credentials
    });
};

exports.upvoteActivity = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    const apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/upvoteActivity';

    console.log("apiUrl: " + apiUrl);

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

        // it uses the layout for all views, and adds the required handlebars as needed
        // into {{{content}}} placeholder !!!
        reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});

    });
};

exports.downvoteActivity = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    const apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/downvoteActivity';

    console.log("apiUrl: " + apiUrl);

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

        // it uses the layout for all views, and adds the required handlebars as needed
        // into {{{content}}} placeholder !!!
        reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});

    });
};

exports.signUp = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    const apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/signUp';

    Wreck.post(apiUrl, {
        payload: JSON.stringify({userToken: token}),
        json: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, (err, res, payload) => {
        if(err) {
            console.log("some error happened");
            throw err;
        }

        console.log("inside web signup -> after API request");

        reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});

    })
};