'use strict';

const Pages = require('../handlers/pages');
const Assets = require('../handlers/assets');
const Actions = require('../handlers/actions');
const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: Pages.home
}, {
    method: 'GET',
    path: '/login',
    handler: Pages.login
}, {
    method: 'POST',
    path: '/login',
    handler: Actions.login
}, {
    method: 'GET',
    path: '/{param*}',
    handler: Assets.servePublicDirectory

}, {
    method: 'GET',
    path: '/create',
    handler: Pages.createActivity,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'POST',
    path: '/create',
    handler: Actions.createActivity,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'GET',
    path: '/logout',
    handler: Actions.logout
}, {
    method: 'GET',
    path: '/register',
    handler: Pages.register
}, {
    method: 'POST',
    path: '/register',
    config: {
        validate: {
            payload: {
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).max(8)
            },
            options: {
                abortEarly: false
            },
            failAction: function (request, reply, source, error) {
                const errors = {};
                const details = error.data.details;
                for(let i = 0; i < details.length; ++i) {
                    if (!errors.hasOwnProperty(details[i].path)) {
                        errors[details[i].path] = details[i].message;
                    }
                }
                reply.view('register', {
                    errors: errors,
                    values: request.payload
                }).code(400);
            }
        }
    },
    handler: Actions.register
}];
