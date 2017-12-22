'use strict';

/**
 * This part of the application is responsible for the webpage shown to the user through her
 * webbrowser. It consumes the API written for this application. That makes it much more
 * modular. The mobile application and the webpage both consume the same API and render the
 * required information in their own way.
 */

const Wreck = require('wreck');

const heroku_mode = true;

/**
 * Retrieves one activity through API (wreck)
 *
 * @param request
 * @param request.auth.credentials.token needs to be set with the users token
 * @param reply
 */
exports.getOne = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;

    // http://localhost:3000/api/activities
    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/activities/' + activityID;
    } else {
        apiUrl = this.apiBaseUrl + '/activities/' + activityID;
    }
    //


    // Wreck is used to fetch the JSON and parse it. Big advantage is, that it is
    // correctly parsed and can be used as payload.
    Wreck.get(apiUrl, { json: true }, (err, res, payload) => {

        if (err) {
            throw err;
        }

        // checks if there is an array of users signed up for the activity and
        // parses it for logged in users. Changes alreadySigendUp if logged in
        // user is in this array. This is needed for buttons in handlebars template
        let alreadySignedUp = false;
        if(payload.users !== undefined) {
            for(var index = 0; index < payload.users.length; index++) {
                if(token === payload.users[index].token) {
                    alreadySignedUp = true;
                    break;
                }
            }
        }

        // it uses the layout for all views, and adds the required handlebars as needed
        // into {{{content}}} placeholder !!!
        reply.view('activity', {
            // the view is created out of layout and index!!! Then two variables are defined
            // an array of recipes (payload) and the user (if he/she is existing). These variables
            // are then used to populate the view!!!
            activity: payload,
            alreadySignedUp: alreadySignedUp,
            user: request.auth.credentials
        });
    });



};

/**
 * Displays the create activity form
 *
 * @param request
 * @param reply
 */
exports.createActivity = function (request, reply) {

    // it uses the layout for all views, and adds the required handlebars as needed
    // into {{{content}}} placeholder !!!
    reply.view('create', {
        user: request.auth.credentials
    });
};

/**
 * Upvotes the activity through API call
 *
 * @param request
 * @param request.auth.credentials.token needs to be set to the logged in user's token
 * @param request.params._id needs to be set to the activities id
 * @param reply
 */
exports.upvoteActivity = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api' + '/activities/' + activityID + '/upvoteActivity';
    } else {
        apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/upvoteActivity';
    }

    Wreck.post(apiUrl, {
        payload: JSON.stringify({userToken: token}),
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
        // FIXME
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com' + '/activities/' + activityID, {user: request.auth.credentials});
        } else {
            reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});
        }
        //


    });
};

/**
 * Downvotes the activity through API call
 *
 * @param request
 * @param request.auth.credentials.token needs to be set to the logged in user's token
 * @param request.params._id needs to be set to the activities id
 * @param reply
 */
exports.downvoteActivity = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/activities/' + activityID + '/downvoteActivity';
    } else {
        apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/downvoteActivity';
    }

    Wreck.post(apiUrl, {
        payload: JSON.stringify({userToken: token}),
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
        // FIXME
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com/activities/' + activityID, {user: request.auth.credentials});
        } else {
            reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});
        }
    });
};

/**
 * Signs up the currently logged in user for an activity
 *
 * @param request
 * @param request.auth.credentials.token needs to be set to the logged in user's token
 * @param request.params._id needs to be set to the activities id
 * @param reply
 */
exports.signUp = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/activities/' + activityID + '/signUp';
    } else {
        apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/signUp';
    }

    Wreck.post(apiUrl, {
        payload: JSON.stringify({userToken: token}),
        json: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, (err, res, payload) => {
        if(err) {
            throw err;
        }
        // FIXME
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com/activities/' + activityID, {user: request.auth.credentials});
        } else {
            reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});
        }
    })
};

/**
 * Signs off the currently logged in user from an activity
 *
 * @param request
 * @param reply
 */
exports.signOff = function (request, reply) {

    const token = request.auth.credentials.token;

    const activityID = request.params._id;
    // FIXME
    let apiUrl = '';
    if(heroku_mode) {
        apiUrl = 'http://blooming-fortress-94706.herokuapp.com/api/activities/' + activityID + '/signOff';
    } else {
        apiUrl = this.apiBaseUrl + '/activities/' + activityID + '/signOff';
    }

    Wreck.post(apiUrl, {
        payload: JSON.stringify({userToken: token}),
        json: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, (err, res, payload) => {
        if(err) {
            throw err;
        }
        // FIXME
        if(heroku_mode) {
            reply.redirect('http://blooming-fortress-94706.herokuapp.com/activities/' + activityID, {user: request.auth.credentials});
        } else {
            reply.redirect(this.webBaseUrl + '/activities/' + activityID, {user: request.auth.credentials});
        }
    })
};