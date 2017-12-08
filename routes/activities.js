'use strict';

const Activities = require('../handlers/activities');

const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/activities',
    handler: Activities.getAll
}, {
    method: 'GET',
    path: '/activities/{name}',
    handler: Activities.getOne
}, {
    method: 'POST',
    path: '/activities',
    handler: Activities.createOne
}];
