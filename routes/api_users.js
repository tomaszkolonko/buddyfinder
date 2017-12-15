'use strict';

const ApiUsers = require('../handlers/api_users');
const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/api/user/{name}',
    handler: ApiUsers.getOne
}, {
    method: 'POST',
    path: '/api/login',
    config: {
        payload: {
            output: 'data',
            parse: true
        },
        validate: {
            payload: {
                username: Joi.string().required(),
                password: Joi.string().min(6).max(8).required()
            },
            options: {
                abortEarly: false
            }
        }
    },
    handler: ApiUsers.login
}, {
    method: 'POST',
    path: '/api/register',
    config: {
        validate: {
            payload: {
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).max(8)
            },
            options: {
                abortEarly: false
            }
        }
    },
    handler: ApiUsers.register
}];
