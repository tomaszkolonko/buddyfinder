'use strict';

const WebUsers = require('../handlers/web_users');
const Assets = require('../handlers/assets');
const Actions = require('../handlers/actions');
const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: WebUsers.home
}, {
    method: 'GET',
    path: '/login',
    handler: WebUsers.login
}, {
    method: 'POST',
    path: '/login',
    config: {
        validate: {
            payload: {
                username: Joi.string().required(),
                password: Joi.string().min(6).max(8).required()
            },
            options: {
                abortEarly: false
            },
            failAction: function (request, reply, source, error) {
                const errors = {};
                const details = error.data.details;
                for(let i = 0; i < details.length; ++i) {
                    if(!errors.hasOwnProperty(details[i].path)) {
                        errors[details[i].path] = details[i].message;
                    }
                }
                reply.view('login', {
                    errors: errors
                }).code(400);
            }
        }
    },
    handler: Actions.login
}, {
    method: 'GET',
    path: '/{param*}',
    handler: Assets.servePublicDirectory

}, {
    method: 'GET',
    path: '/logout',
    handler: Actions.logout
}, {
    method: 'GET',
    path: '/register',
    handler: WebUsers.register
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
                    values: request.payload,
                    user: request.auth.credentials
                }).code(400);
            }
        }
    },
    handler: Actions.register
}, {
    method: 'GET',
    path: '/myProfile',
    handler: WebUsers.myProfile,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'GET',
    path: '/myProfile/edit',
    handler: WebUsers.editMyProfile,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'POST',
    path: '/myProfile/edit',
    handler: Actions.editMyProfile,
    config: {
        auth: {
            mode: 'required'
        },
        validate: {
            payload: {
                firstname: Joi.string().allow(''),
                lastname: Joi.string().allow(''),
                description: Joi.string().allow(''),
                canton: Joi.string().allow(''),
                country: Joi.string().allow(''),
                email: Joi.string().email().required(),
                website: Joi.string().allow(''),
                phone: Joi.string().allow(''),
                password: Joi.string().min(6).max(8).allow('')
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
                reply.view('editProfile', {
                    errors: errors,
                    userData: request.payload,
                    user: request.auth.credentials
                }).code(400);
            }
        }
    }
}];
