'use strict';

const Users = require('../handlers/api_users');

module.exports = [{
    method: 'GET',
    path: '/api/user/{name}',
    handler: Users.getOne
}, {
    method: 'POST',
    path: '/api/login',
    config: {
        payload: {
            output: 'data',
            parse: true
        }
    },
    handler: Users.login
}, {
    method: 'POST',
    path: '/api/register',
    handler: Users.register
}];
