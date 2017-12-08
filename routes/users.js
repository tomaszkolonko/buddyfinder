'use strict';

const Users = require('../handlers/users');

const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/user/{name}',
    handler: Users.getOne
}];
