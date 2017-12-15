'use strict';

const Wreck = require('wreck');

exports.getOne = function (request, reply) {

    console.log(request.payload);
    console.log(request.query);
    console.log(request.params);

    // http://localhost:3000/api/activities
    const apiUrl = this.apiBaseUrl + '/activities/{name}';



};

exports.createActivity = function (request, reply) {

    // it uses the layout for all views, and adds the required handlebars as needed
    // into {{{content}}} placeholder !!!
    reply.view('create', {
        user: request.auth.credentials
    });
};